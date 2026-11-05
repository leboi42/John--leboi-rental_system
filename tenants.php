<?php
require_once 'config.php'; require_login(); $pdo=db();
if($_SERVER['REQUEST_METHOD']==='POST'){
 verify_csrf(); $action=$_POST['action']??'';
 if($action==='delete'){ $pdo->prepare('DELETE FROM tenants WHERE id=?')->execute([(int)$_POST['id']]); flash('Tenant deleted. Their payment records are also deleted.'); header('Location: tenants.php'); exit; }
 $id=(int)($_POST['id']??0); $name=trim($_POST['full_name']??''); $phone=trim($_POST['phone']??''); $email=trim($_POST['email']??''); $nid=trim($_POST['national_id']??''); $house=($_POST['house_id']??'')!==''?(int)$_POST['house_id']:null; $date=$_POST['move_in_date']??'';
 if($name===''||$phone===''){flash('Name and phone are required.','error');}
 else {
  if($id) $pdo->prepare('UPDATE tenants SET full_name=?,phone=?,email=?,national_id=?,house_id=?,move_in_date=? WHERE id=?')->execute([$name,$phone,$email?:null,$nid?:null,$house,$date?:null,$id]);
  else $pdo->prepare('INSERT INTO tenants(full_name,phone,email,national_id,house_id,move_in_date) VALUES(?,?,?,?,?,?)')->execute([$name,$phone,$email?:null,$nid?:null,$house,$date?:null]);
  if($house) $pdo->prepare("UPDATE houses SET status='Occupied' WHERE id=?")->execute([$house]);
  flash('Tenant saved successfully.');
 }
 header('Location: tenants.php'); exit;
}
$edit=null;if(isset($_GET['edit'])){$s=$pdo->prepare('SELECT * FROM tenants WHERE id=?');$s->execute([(int)$_GET['edit']]);$edit=$s->fetch();}
$houses=$pdo->query("SELECT id,house_no FROM houses WHERE status IN ('Vacant','Occupied') ORDER BY house_no")->fetchAll();
$tenants=$pdo->query('SELECT t.*,h.house_no FROM tenants t LEFT JOIN houses h ON h.id=t.house_id ORDER BY t.full_name')->fetchAll();
$pageTitle='Tenant management';require 'header.php';
?>
<section class="panel"><h2><?=$edit?'Edit tenant':'Register a tenant'?></h2><form method="post" class="form-grid"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><input type="hidden" name="id" value="<?=e($edit['id']??'')?>"><label>Full name<input name="full_name" required value="<?=e($edit['full_name']??'')?>"></label><label>Phone number<input name="phone" required value="<?=e($edit['phone']??'')?>"></label><label>Email<input type="email" name="email" value="<?=e($edit['email']??'')?>"></label><label>National ID (optional)<input name="national_id" value="<?=e($edit['national_id']??'')?>"></label><label>House<select name="house_id"><option value="">Not assigned</option><?php foreach($houses as $h): ?><option value="<?=$h['id']?>" <?=((string)($edit['house_id']??'')===(string)$h['id'])?'selected':''?>><?=e($h['house_no'])?></option><?php endforeach; ?></select></label><label>Move-in date<input type="date" name="move_in_date" value="<?=e($edit['move_in_date']??'')?>"></label><div class="form-actions"><button class="btn">Save tenant</button><?php if($edit): ?><a class="btn secondary" href="tenants.php">Cancel</a><?php endif; ?></div></form></section>
<section class="panel"><h2>Tenants (<?=count($tenants)?>)</h2><div class="table-wrap"><table><thead><tr><th>Name</th><th>Phone</th><th>House</th><th>Move-in</th><th>Actions</th></tr></thead><tbody><?php foreach($tenants as $t): ?><tr><td><?=e($t['full_name'])?></td><td><?=e($t['phone'])?></td><td><?=e($t['house_no']??'Not assigned')?></td><td><?=e($t['move_in_date']??'—')?></td><td class="actions"><a href="tenants.php?edit=<?=$t['id']?>">Edit</a><form method="post" onsubmit="return confirm('Delete this tenant and their payment history?')"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?=$t['id']?>"><button class="link danger">Delete</button></form></td></tr><?php endforeach; ?><?php if(!$tenants): ?><tr><td colspan="5">No tenants registered yet.</td></tr><?php endif; ?></tbody></table></div></section>
<?php require 'footer.php'; ?>

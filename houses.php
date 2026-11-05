<?php
require_once 'config.php'; require_login(); $pdo=db();
if ($_SERVER['REQUEST_METHOD']==='POST') {
 verify_csrf(); $action=$_POST['action'] ?? '';
 if($action==='delete') { $id=(int)$_POST['id']; $pdo->prepare('DELETE FROM houses WHERE id=?')->execute([$id]); flash('House deleted.'); header('Location: houses.php'); exit; }
 $id=(int)($_POST['id'] ?? 0); $no=trim($_POST['house_no'] ?? ''); $type=trim($_POST['house_type'] ?? ''); $rent=(float)($_POST['monthly_rent'] ?? 0); $status=$_POST['status'] ?? 'Vacant';
 if($no==='' || $type==='' || $rent<0 || !in_array($status,['Vacant','Occupied','Maintenance'],true)) { flash('Please enter valid house details.','error'); }
 else {
  try { if($id) $pdo->prepare('UPDATE houses SET house_no=?,house_type=?,monthly_rent=?,status=? WHERE id=?')->execute([$no,$type,$rent,$status,$id]); else $pdo->prepare('INSERT INTO houses(house_no,house_type,monthly_rent,status) VALUES(?,?,?,?)')->execute([$no,$type,$rent,$status]); flash('House saved successfully.'); }
  catch(PDOException $e){ flash('Could not save. Check that the house number is unique.','error'); }
 }
 header('Location: houses.php'); exit;
}
$edit=null; if(isset($_GET['edit'])) { $s=$pdo->prepare('SELECT * FROM houses WHERE id=?'); $s->execute([(int)$_GET['edit']]); $edit=$s->fetch(); }
$houses=$pdo->query('SELECT * FROM houses ORDER BY house_no')->fetchAll();
$pageTitle='House management'; require 'header.php';
?>
<section class="panel"><h2><?=$edit?'Edit house':'Add a house'?></h2><form method="post" class="form-grid"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><input type="hidden" name="id" value="<?=e($edit['id']??'')?>"><label>House number<input name="house_no" required value="<?=e($edit['house_no']??'')?>" placeholder="e.g. A01"></label><label>House type<input name="house_type" required value="<?=e($edit['house_type']??'')?>" placeholder="Bedsitter, 1 bedroom..."></label><label>Monthly rent (KSh)<input type="number" name="monthly_rent" min="0" step="0.01" required value="<?=e($edit['monthly_rent']??'')?>"></label><label>Status<select name="status"><?php foreach(['Vacant','Occupied','Maintenance'] as $v): ?><option <?=$v===($edit['status']??'Vacant')?'selected':''?>><?=$v?></option><?php endforeach; ?></select></label><div class="form-actions"><button class="btn">Save house</button><?php if($edit): ?><a class="btn secondary" href="houses.php">Cancel</a><?php endif; ?></div></form></section>
<section class="panel"><h2>Registered houses (<?=count($houses)?>)</h2><div class="table-wrap"><table><thead><tr><th>House no.</th><th>Type</th><th>Monthly rent</th><th>Status</th><th>Actions</th></tr></thead><tbody><?php foreach($houses as $h): ?><tr><td><?=e($h['house_no'])?></td><td><?=e($h['house_type'])?></td><td>KSh <?=number_format((float)$h['monthly_rent'],2)?></td><td><span class="pill"><?=e($h['status'])?></span></td><td class="actions"><a href="houses.php?edit=<?=$h['id']?>">Edit</a><form method="post" onsubmit="return confirm('Delete this house? Any tenant link will be cleared.')"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?=$h['id']?>"><button class="link danger">Delete</button></form></td></tr><?php endforeach; ?><?php if(!$houses): ?><tr><td colspan="5">No houses added yet.</td></tr><?php endif; ?></tbody></table></div></section>
<?php require 'footer.php'; ?>

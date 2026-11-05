<?php
require_once 'config.php';require_login();$pdo=db();
if($_SERVER['REQUEST_METHOD']==='POST'){verify_csrf();$tenant=(int)($_POST['tenant_id']??0);$amount=(float)($_POST['amount']??0);$date=$_POST['payment_date']??date('Y-m-d');$method=$_POST['payment_method']??'Cash';$ref=trim($_POST['reference_no']??'');$notes=trim($_POST['notes']??'');
 if($tenant<1||$amount<=0){flash('Select a tenant and enter an amount greater than zero.','error');}
 else{$pdo->prepare('INSERT INTO payments(tenant_id,amount,payment_date,payment_method,reference_no,notes) VALUES(?,?,?,?,?,?)')->execute([$tenant,$amount,$date,$method,$ref?:null,$notes?:null]);flash('Payment recorded successfully.');}
 header('Location: payments.php');exit;
}
$tenants=$pdo->query('SELECT id,full_name FROM tenants ORDER BY full_name')->fetchAll();
$payments=$pdo->query('SELECT p.*,t.full_name FROM payments p JOIN tenants t ON t.id=p.tenant_id ORDER BY p.payment_date DESC,p.id DESC')->fetchAll();
$pageTitle='Rent payments';require 'header.php';
?>
<section class="panel"><h2>Record rent payment</h2><?php if(!$tenants): ?><p class="muted">Register a tenant before recording a payment.</p><?php else: ?><form method="post" class="form-grid"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><label>Tenant<select name="tenant_id" required><option value="">Choose tenant</option><?php foreach($tenants as $t): ?><option value="<?=$t['id']?>"><?=e($t['full_name'])?></option><?php endforeach; ?></select></label><label>Amount (KSh)<input type="number" name="amount" min="0.01" step="0.01" required></label><label>Payment date<input type="date" name="payment_date" value="<?=date('Y-m-d')?>" required></label><label>Payment method<select name="payment_method"><option>Cash</option><option>M-Pesa</option><option>Bank</option><option>Other</option></select></label><label>Reference number (optional)<input name="reference_no"></label><label>Notes (optional)<input name="notes"></label><div class="form-actions"><button class="btn">Save payment</button></div></form><?php endif; ?></section>
<section class="panel"><h2>Payment history</h2><div class="table-wrap"><table><thead><tr><th>Date</th><th>Tenant</th><th>Method</th><th>Reference</th><th>Amount</th></tr></thead><tbody><?php foreach($payments as $p): ?><tr><td><?=e($p['payment_date'])?></td><td><?=e($p['full_name'])?></td><td><?=e($p['payment_method'])?></td><td><?=e($p['reference_no']??'—')?></td><td>KSh <?=number_format((float)$p['amount'],2)?></td></tr><?php endforeach; ?><?php if(!$payments): ?><tr><td colspan="5">No payments recorded yet.</td></tr><?php endif; ?></tbody></table></div></section>
<?php require 'footer.php'; ?>

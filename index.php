<?php
require_once 'config.php'; require_login();
$pdo = db();
$total = (int)$pdo->query('SELECT COUNT(*) FROM houses')->fetchColumn();
$occupied = (int)$pdo->query("SELECT COUNT(*) FROM houses WHERE status='Occupied'")->fetchColumn();
$vacant = (int)$pdo->query("SELECT COUNT(*) FROM houses WHERE status='Vacant'")->fetchColumn();
$tenants = (int)$pdo->query('SELECT COUNT(*) FROM tenants')->fetchColumn();
$income = (float)$pdo->query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE MONTH(payment_date)=MONTH(CURRENT_DATE()) AND YEAR(payment_date)=YEAR(CURRENT_DATE())")->fetchColumn();
$recent = $pdo->query('SELECT p.payment_date,p.amount,p.payment_method,t.full_name FROM payments p JOIN tenants t ON t.id=p.tenant_id ORDER BY p.payment_date DESC,p.id DESC LIMIT 5')->fetchAll();
$pageTitle='Dashboard'; require 'header.php';
?>
<div class="cards">
 <div class="stat"><span>Total houses</span><strong><?=$total?></strong></div>
 <div class="stat"><span>Occupied houses</span><strong><?=$occupied?></strong></div>
 <div class="stat"><span>Vacant houses</span><strong><?=$vacant?></strong></div>
 <div class="stat"><span>Registered tenants</span><strong><?=$tenants?></strong></div>
 <div class="stat highlight"><span>Payments this month</span><strong>KSh <?=number_format($income,2)?></strong></div>
</div>
<section class="panel"><div class="panel-head"><h2>Recent rent payments</h2><a class="btn" href="payments.php">Record payment</a></div>
<?php if(!$recent): ?><p class="muted">No payments recorded yet.</p><?php else: ?><div class="table-wrap"><table><thead><tr><th>Date</th><th>Tenant</th><th>Method</th><th>Amount</th></tr></thead><tbody><?php foreach($recent as $r): ?><tr><td><?=e($r['payment_date'])?></td><td><?=e($r['full_name'])?></td><td><?=e($r['payment_method'])?></td><td>KSh <?=number_format((float)$r['amount'],2)?></td></tr><?php endforeach; ?></tbody></table></div><?php endif; ?></section>
<?php require 'footer.php'; ?>

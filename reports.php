<?php
require_once 'config.php';require_login();$pdo=db();
$month=$pdo->query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE MONTH(payment_date)=MONTH(CURRENT_DATE()) AND YEAR(payment_date)=YEAR(CURRENT_DATE())")->fetchColumn();
$year=$pdo->query("SELECT COALESCE(SUM(amount),0) FROM payments WHERE YEAR(payment_date)=YEAR(CURRENT_DATE())")->fetchColumn();
$byTenant=$pdo->query('SELECT t.full_name,COALESCE(SUM(p.amount),0) total FROM tenants t LEFT JOIN payments p ON p.tenant_id=t.id GROUP BY t.id ORDER BY total DESC')->fetchAll();
$pageTitle='Reports';require 'header.php';
?>
<div class="cards"><div class="stat"><span>Collected this month</span><strong>KSh <?=number_format((float)$month,2)?></strong></div><div class="stat"><span>Collected this year</span><strong>KSh <?=number_format((float)$year,2)?></strong></div></div>
<section class="panel"><h2>Payments by tenant (all time)</h2><div class="table-wrap"><table><thead><tr><th>Tenant</th><th>Total paid (KSh)</th></tr></thead><tbody><?php foreach($byTenant as $r): ?><tr><td><?=e($r['full_name'])?></td><td><?=number_format((float)$r['total'],2)?></td></tr><?php endforeach; ?><?php if(!$byTenant): ?><tr><td colspan="2">No tenants available.</td></tr><?php endif; ?></tbody></table></div><p class="muted">These reports total recorded payments. They do not calculate arrears or allocate payments to specific rental months.</p></section>
<?php require 'footer.php'; ?>

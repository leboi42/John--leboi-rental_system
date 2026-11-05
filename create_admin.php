<?php
require_once 'config.php';
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($username === '' || strlen($password) < 10) {
        $message = 'Enter a username and a password of at least 10 characters.';
    } else {
        try {
            $stmt = db()->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
            $stmt->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
            $message = 'Administrator created. IMPORTANT: delete create_admin.php from your hosting account now.';
        } catch (PDOException $ex) {
            $message = 'Could not create administrator. Check that the database is imported and the username is unused.';
        }
    }
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Create administrator</title><link rel="stylesheet" href="assets/style.css"></head>
<body class="auth-page"><main class="auth-card"><h1>Create administrator</h1><p>Run this page once after importing database.sql.</p><?php if($message): ?><div class="notice"><?=e($message)?></div><?php endif; ?><form method="post"><input type="hidden" name="csrf" value="<?=e(csrf_token())?>"><label>Username</label><input name="username" required maxlength="80"><label>Password (minimum 10 characters)</label><input type="password" name="password" required minlength="10"><button class="btn full">Create administrator</button></form><a href="login.php">Go to login</a></main></body></html>

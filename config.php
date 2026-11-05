<?php
declare(strict_types=1);
session_start();

$databaseConfigPath = __DIR__ . '/config.local.php';
if (!is_file($databaseConfigPath)) {
    throw new RuntimeException(
        'Database configuration is missing. Copy config.local.php.example to config.local.php and enter your database settings.'
    );
}

$databaseConfig = require $databaseConfigPath;
if (!is_array($databaseConfig)) {
    throw new RuntimeException('Database configuration must return an array.');
}

foreach (['host', 'name', 'user', 'pass'] as $key) {
    if (!isset($databaseConfig[$key]) || !is_string($databaseConfig[$key])) {
        throw new RuntimeException('Database configuration is missing a valid "' . $key . '" value.');
    }
}

define('DB_HOST', $databaseConfig['host']);
define('DB_NAME', $databaseConfig['name']);
define('DB_USER', $databaseConfig['user']);
define('DB_PASS', $databaseConfig['pass']);

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
function e($value): string { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
function require_login(): void {
    if (empty($_SESSION['admin_id'])) {
        header('Location: login.php');
        exit;
    }
}
function flash(string $message, string $type='success'): void {
    $_SESSION['flash'] = ['message'=>$message, 'type'=>$type];
}
function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function verify_csrf(): void {
    if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
        http_response_code(419);
        exit('Invalid form token. Please go back, refresh, and try again.');
    }
}

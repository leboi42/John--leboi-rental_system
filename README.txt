JOHN LEBOI RENTAL MANAGEMENT SYSTEM
===================================

CONTENTS
- Dashboard
- House management (add, edit, delete, list)
- Tenant management (register, edit, delete, assign house)
- Rent payment recording and payment history
- Basic payment reports
- Administrator login

REQUIREMENTS
- PHP 8.0+ (PHP 8.1+ recommended)
- MySQL 5.7+ or MariaDB 10.3+
- PHP PDO MySQL extension enabled
- HTTPS enabled on your hosting account

IMPORTANT LIMITATIONS
- This is a starter rental management system. It records payments, but does not
  yet calculate monthly arrears, send SMS/email reminders, integrate M-Pesa,
  generate PDF receipts, or support multiple landlords.
- Test with sample data before using real tenant information.
- Make regular database backups and use a strong administrator password.

INSTALLATION ON INFINITYFREE OR OTHER SHARED PHP HOSTING
1. In your hosting control panel, create a MySQL database and database user.
2. Grant the user access to the database. Record the exact database hostname,
   database name, username, and password displayed by the provider.
3. Open phpMyAdmin from the hosting control panel, select the new database,
   and import database.sql.
4. Copy config.local.php.example to config.local.php. Enter the database details
   in config.local.php; do not put real credentials in config.php or GitHub.
   This private file is excluded by .gitignore.
5. Upload the PHP files and assets to your website's document root. To use the
   PHP/MySQL app, make sure index.php is the default page; index.html is a
   separate browser-only demo and should not take precedence.
6. Visit https://YOUR-DOMAIN/create_admin.php and create your administrator.
7. IMPORTANT: delete create_admin.php from the server immediately after creating
   the administrator.
8. Visit https://YOUR-DOMAIN/login.php and sign in.
9. Add houses first, then register tenants, then record payments.

PHONE UPLOAD NOTES
- Download and extract this ZIP using your Android file manager.
- Use your hosting provider's File Manager in Chrome, or its supported upload
  method, to upload the extracted files into the website document root.
- Import database.sql using phpMyAdmin in the hosting control panel.
- Create config.local.php on the server with the credentials from your hosting
  control panel. Never commit or share this file.
- Do not upload the ZIP as the only file unless your host's installer extracts
  it into the correct document root.

SECURITY
- Keep config.php private and never share database credentials.
- Use HTTPS and a unique strong admin password.
- Delete create_admin.php immediately after first admin creation.
- Do not use public/shared Wi-Fi for administration.
- Keep PHP and hosting software updated.

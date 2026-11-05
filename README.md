# Rental Management

This repository contains two versions of the rental management app:

- **Browser demo:** `index.html` with records stored only in that browser's local storage.
- **PHP/MySQL app:** `index.php` and the PHP pages, backed by MySQL through PDO.

## PHP/MySQL setup

1. Create a MySQL database and database user in your hosting control panel.
2. Import `database.sql` into the new database using phpMyAdmin.
3. Copy `config.local.php.example` to `config.local.php`, then enter the host,
   database name, username, and password shown by your provider.
4. Upload the PHP files and `assets` folder to the website document root. Ensure
   `index.php` is the default page; `index.html` is the separate browser demo.
5. Visit `/create_admin.php` to create the administrator, then delete
   `create_admin.php` from the server immediately.

`config.local.php` contains database credentials and is excluded from Git. Do not
commit it or share it publicly. Use the private example file as a template.

## Browser demo

Open `index.html` in a modern browser. This version does not use PHP or MySQL;
its records stay in that browser profile and are not shared across devices.

See `README.txt` for additional hosting and installation guidance.

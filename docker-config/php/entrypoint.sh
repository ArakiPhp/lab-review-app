#!/bin/bash
set -e

# 権限設定（失敗してもコンテナは起動する）
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache 2>/dev/null || echo "chown skipped"
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || echo "chmod skipped"

# PHP-FPMを起動
exec php-fpm

FROM php:8.2-fpm
EXPOSE 5173
COPY php.ini /usr/local/etc/php/

RUN apt-get update \
    && apt-get install -y zlib1g-dev mariadb-client vim libzip-dev nodejs npm libsqlite3-dev \
    && docker-php-ext-install zip pdo_mysql pdo_sqlite

RUN pecl install xdebug && docker-php-ext-enable xdebug

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/local/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /composer
ENV PATH $PATH:/composer/vendor/bin

# 修正箇所
ARG USER_NAME
ARG GROUP_NAME
ARG USER_ID
ARG GROUP_ID
RUN groupadd -g $GROUP_ID $GROUP_NAME
RUN useradd -m -s /bin/bash -u $USER_ID -g $GROUP_ID $USER_NAME

USER $USERNAME
WORKDIR /var/www

RUN composer global require "laravel/installer"

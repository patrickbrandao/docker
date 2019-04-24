#!/bin/sh

# Configurar PHP7 FPM
	mkdir -p /run/php7
	mkdir -p /var/log/php7

	touch /var/log/php7/www.log
	touch /var/log/php7/fpm.log
	touch /var/log/php7/fpm.err


# Servico no supervisor
	mkdir -p /etc/supervisor/conf.d
    (
    	echo '[program:php-fpm7]'
        echo 'command=/usr/sbin/php-fpm7 -F'
        echo 'autostart=true'
        echo 'autorestart=true'
        echo 'user=root'
        echo 'priority=90'
		echo 'startretries=999999'; \
		echo 'startsecs=3'; \
		echo 'stopwaitsecs=3'; \
        echo 'stdout_logfile=/var/log/php7/fpm.log'
        echo 'stdout_logfile_maxbytes=0'
        echo 'stderr_logfile=/var/log/php7/fpm.err'
        echo 'stderr_logfile_maxbytes=0'
        echo 'priority=75'
    ) > /etc/supervisor/conf.d/php-fpm7.conf




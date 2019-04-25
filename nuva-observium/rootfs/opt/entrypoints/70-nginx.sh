#!/bin/sh

# Configurar NGINX
	mkdir -p /run/nginx
	mkdir -p /var/log/nginx
	touch /var/log/nginx/access.log
	touch /var/log/nginx/error.log
	
	chown nginx.nginx /var/log/nginx
	chown nginx.nginx /var/log/nginx/access.log
	chown nginx.nginx /var/log/nginx/error.log


# Servico no supervisor
	mkdir -p /etc/supervisor/conf.d
    (
    	echo '[program:nginx]'
        echo 'command=/usr/sbin/nginx'
        echo 'priority=60'
		echo 'startretries=999999'; \
		echo 'startsecs=3'; \
		echo 'stopwaitsecs=3'; \
        echo 'autostart=true'
        echo 'autorestart=true'
        echo 'user=root'
        echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
        echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
    ) > /etc/supervisor/conf.d/nginx.conf


exit 0


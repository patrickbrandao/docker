#!/bin/sh


# Fast CGI Wrapper
	mkdir -p /run/fcgiwrap

# Servico no supervisor
	# Daemon:
	# spawn-fcgi -s /run/fcgiwrap/fcgiwrap.sock /usr/bin/fcgiwrap
	# Foreground:
	# spawn-fcgi -n -s /run/fcgiwrap/fcgiwrap.sock /usr/bin/fcgiwrap
	# Foreground nginx:
	# spawn-fcgi -u nginx -g nginx -n -s /run/fcgiwrap/fcgiwrap.sock /usr/bin/fcgiwrap
	mkdir -p /etc/supervisor/conf.d
    (
		echo '[program:fcgiwrap]'
		echo 'command=spawn-fcgi -u nginx -g nginx -n -s /run/fcgiwrap/fcgiwrap.sock /usr/bin/fcgiwrap'
		echo 'priority=40'
		echo 'startretries=999999'; \
		echo 'startsecs=3'; \
		echo 'stopwaitsecs=3'; \
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
    ) > /etc/supervisor/conf.d/fcgiwrap.conf


exit 0



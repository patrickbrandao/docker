#!/bin/sh


# Smokeping
	mkdir -p /var/log/smokeping
	mkdir -p /var/lib/smokeping
	mkdir -p /etc/smokeping/include
    mkdir -p /var/lib/smokeping/.simg

	touch /var/log/smokeping/smokeping.log

	chown -R nginx.nginx /var/lib/smokeping
    chown nginx.nginx /var/lib/smokeping/.simg

	# Daemon:
	# /usr/bin/smokeping --config=/etc/smokeping/config --logfile=/var/log/smokeping/smokeping.log
	# Foreground:
	# /usr/bin/smokeping --nodaemon --config=/etc/smokeping/config --logfile=/var/log/smokeping/smokeping.log
	mkdir -p /etc/supervisor/conf.d
    (
    	echo '[program:smokeping]'
        echo 'command=/usr/bin/smokeping --nodaemon --config=/etc/smokeping/config --logfile=/var/log/smokeping/smokeping.log'
        echo 'priority=35'
		echo 'startretries=999999'; \
		echo 'startsecs=3'; \
		echo 'stopwaitsecs=3'; \
        echo 'autostart=true'
        echo 'autorestart=true'
        echo 'user=root'
        echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
        echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
    ) > /etc/supervisor/conf.d/smokeping.conf


    # Adicionar inclusoes
    # - inclusoes manuais
    egrep '@include./etc/smokeping/include/Targets' /etc/smokeping/config >/dev/null || {
    	echo "@include /etc/smokeping/include/Targets" >> /etc/smokeping/config
    }
    # - inclusoes geradas pela lista de hosts do Observium
    egrep '@include./etc/smokeping/include/Observium' /etc/smokeping/config >/dev/null || {
    	echo "@include /etc/smokeping/include/Observium" >> /etc/smokeping/config
    }

    # Garantir existencia
    touch /etc/smokeping/DNS
    touch /etc/smokeping/include/Targets
    touch /etc/smokeping/include/Observium



exit 0



#!/bin/sh


	[ -x /usr/bin/smokeping ] || exit 0


	# Preparar ambiente para smokeping
	mkdir -p /run/fcgiwrap

	mkdir -p /etc/smokeping
	mkdir -p /etc/smokeping/include


	mkdir -p /var/log/smokeping
	touch /var/log/smokeping/smokeping.log


	mkdir -p /var/lib/smokeping/.simg
    chmod 777 /var/lib/smokeping -R
    chmod 777 /var/lib/smokeping/.simg
	chown -R nginx.nginx /var/lib/smokeping
    chown nginx.nginx /var/lib/smokeping/.simg

	# bug de caminho
	(
		mkdir -p /usr/etc
		cd /usr/etc && ln -s /etc/smokeping smokeping
	)

	# Arquivos default
	touch /etc/smokeping/DNS 2>/dev/null
	touch /etc/smokeping/config 2>/dev/null
	touch /etc/smokeping/include/Targets 2>/dev/null

	# IMG
	mkdir -p /usr/share/webapps/smokeping
	rm -rf /usr/share/webapps/smokeping/img
	ln -s /var/lib/smokeping/.simg /usr/share/webapps/smokeping/img

exit 0


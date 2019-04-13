#!/bin/sh

#
# Personalizacao de comandos
#

	# copiar arquivos e links
	cp /bin/vps /root/.bashrc
	ln -s /usr/sbin/fping /usr/bin/fping

	# ajustes de permissoes e propriedades
	chmod +x /bin/vps
	chmod +x /opt/*.sh
	chmod +x /opt/entrypoints/*.sh
	chmod +x /root/.bashrc /bin/vps

	# timezone
	echo "${TZ}" > /etc/timezone; \
	ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime; \



#!/bin/sh

	# script de boot para variaveis de ambiente
	touch /etc/profile.d/00-env-vars.sh
	chmod +x /etc/profile.d/00-env-vars.sh

	# Incluir variaveis de ambiente
	(
		echo '#!/bin/sh'
		echo
		echo '[ -x /bin/env.sh ] && . /bin/env.sh'
		echo
	) > /etc/profile.d/00-env-vars.sh
	chmod +x /etc/profile.d/00-env-vars.sh

	# salvar UUID no machine-id
	[ "x$UUID" = "x" ] && [ -x /usr/bin/uuidgen ] && UUID=$(/usr/bin/uuidgen -t)
	[ "x$UUID" = "x" ] || echo "$UUID" > /etc/machine-id

	# supervisor
	[ -d /var/log/supervisor ] || mkdir -p /var/log/supervisor
	touch /var/log/supervisor/supervisord.log

	# Segurar boot para analise de scripts
	[ "x$ENTRYPOINT_WAIT" = "x" ] || sleep 9988776655

exit 0

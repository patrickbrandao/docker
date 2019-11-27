#!/bin/sh


	# Salvar variaveis de ambiente para manter valores apos reiniciar container
	env | egrep -v '^(_|OLDPWD|PWD|SHLVL|PATH|PS1|TZ)=' | \
		while read line; do
			echo "export $(echo $line | sed 's#=#=\"#')\""
		done > /etc/env.d/00-docker.sh
	chmod +x /etc/env.d/00-docker.sh



true


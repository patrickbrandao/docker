#!/bin/sh

#
# Reunir variaveis de ambiente geradas pelo DOCKER e pelos scripts de entrypoint
#
	# diretorio atual
	tmp=$(pwd)

# Diretorio de scripts de definicao de variaveis
	mkdir -p /etc/env.d 2>/dev/null

# Entrar na pasta, se possivel
	if [ -d /etc/env.d ]; then
		cd /etc/env.d
		if [ "$?" = "0" ]; then

			# Incluir todos os scripts .sh executaveis
			for escript in *.sh; do
				[ -x "$escript" ] || continue
				. /etc/env.d/$escript
			done 2>/dev/null
		fi
	fi

	# voltar ao diretorio atual
	cd $tmp


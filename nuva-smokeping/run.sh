#!/bin/sh

#
# Script para rodar observium em ambiente simples, de maneira rapida
#
_abort(){ echo; echo $@; echo; exit 1; }

# Variaveis
	IMAGE=nuva-smokeping
	NAME=$IMAGE
	LOOPBACK=100.127.255.81
	UUID=$(uuid -1)

# Apagar container atual
	[ "$1" = "restart" ] && {
		echo "Limpando..."
		docker stop $NAME 2>/dev/null
		docker stop $NAME 2>/dev/null
		docker rm $NAME 2>/dev/null
	}

# Dados persistentes
	# - pasta compartilhada entre todas as VPSs
	SHAREDIR=/storage/shared
	mkdir -p $SHAREDIR

	# - pasta de dados privados persistentes da VPS
	DATADIR=/storage/$NAME
	mkdir -p $DATADIR

	# - pasta do smokeping
	SMOKEDIR=/storage/_smokeping/$IMAGE
	mkdir -p $SMOKEDIR/include
	mkdir -p $SMOKEDIR/lib

# Rodar
	docker run -d --restart=always \
		-h $NAME --name=$NAME \
		--user=root --cap-add=ALL --privileged \
		--env UUID=$UUID \
		--env LOOPBACKS=$LOOPBACK \
		--env ROOT_PASSWORD=tulipa \
        -p 17080:80/tcp -p 17022:22/tcp \
        --mount type=bind,source=$SHAREDIR,destination=/shared,readonly=false \
        --mount type=bind,source=$DATADIR,destination=/data,readonly=false \
        --mount type=bind,source=$SMOKEDIR/include,destination=/etc/smokeping/include,readonly=false \
        --mount type=bind,source=$SMOKEDIR/lib,destination=/var/lib/smokeping,readonly=false \
			$IMAGE || _abort "Erro ao rodar container: $NAME"


exit


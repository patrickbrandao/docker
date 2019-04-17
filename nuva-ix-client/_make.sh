#!/bin/sh

_abort(){ echo $1; exit $2; }

IMAGE=nuva-ix-client

# Apagar imagem
echo "#> Apagando imagem"
	docker rmi $IMAGE

# Apagar caches
	[ "$1" = "cache" ] || {
		echo "#> Apagando cache de imagens"
		docker image prune -f
	}

#------------------------------------------------------------------------------------------

# Construir imagem
echo "#> Construindo nova imagem: $IMAGE"
docker build -t $IMAGE .


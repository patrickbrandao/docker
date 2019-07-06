#!/bin/sh


IMAGE=nuva-quagga


# Apagar imagem, caso esteja em uso dara' errado
	echo "#> Apagando imagem"
	docker rmi $IMAGE

# Apagar caches, rode: ./_make.sh nocache
	[ "$1" = "nocache" ] || {
		echo "#> Apagando cache de imagens"
		docker image prune -f
	}

#------------------------------------------------------------------------------------------

# Construir imagem
	echo "#> Construindo nova imagem: $IMAGE"
	docker build -t $IMAGE .


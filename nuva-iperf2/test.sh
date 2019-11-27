#!/bin/sh

_abort(){ echo; echo $@; echo; exit 1; }

IMAGE=nuva-iperf2
NAME=$IMAGE-test
MAC=00:00:01:bb:00:00
IP0=10.80.0.191
LOOPBACK=100.127.255.191
UUID=$(uuid -1)

# Apagar
	echo "Limpando..."
	docker stop $NAME 2>/dev/null
	docker stop $NAME 2>/dev/null
	docker rm $NAME 2>/dev/null

# Apagar imagem
	echo "Apagar imagem..."
	docker rmi $IMAGE 2>/dev/null

# Construir imagem
	docker build -t $IMAGE .  || _abort "Erro ao construir imagem: $IMAGE"

# Rede de VPSs em containers
	docker network create vpsnet0 -d bridge --subnet 10.80.0.0/24 2>/dev/null

# Dados persistentes
	# - pasta compartilhada entre todas as VPSs
	SHAREDIR=/tmp/tests/shared
	mkdir -p $SHAREDIR

	# - pasta de dados privados persistentes da VPS
	DATADIR=/tmp/tests/$IMAGE
	mkdir -p $DATADIR

# Teste
	# - container na rede padrao do docker
	docker run -d --restart=always \
		--network vpsnet0 --ip=$IP0 --mac-address $MAC \
		-h $NAME --name=$NAME \
		--user=root --cap-add=ALL --privileged \
		--env UUID=$UUID \
		--env LOOPBACKS=$LOOPBACK \
		--env ROOT_PASSWORD=tulipa \
		-p 5080:80/tcp -p 5022:22/tcp \
		-p 5001-5009:5001-5009 \
		--mount type=bind,source=$SHAREDIR,destination=/shared,readonly=false \
		--mount type=bind,source=$DATADIR,destination=/data,readonly=false \
			$IMAGE || _abort "Erro ao rodar container: $NAME"


	echo; echo; echo "Container:       $NAME"; echo; echo; echo


exit


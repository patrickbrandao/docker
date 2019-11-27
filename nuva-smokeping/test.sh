#!/bin/sh

_abort(){ echo; echo $@; echo; exit 1; }

IMAGE=nuva-smokeping
NAME=$IMAGE-test
LOOPBACK=100.127.255.177
MAC=00:00:01:77:77:00
IP0=10.80.0.177
IP1=10.80.1.177
UUID=$(uuid -1)
EXTRA_ARGS="$@"

# Apagar
	echo "Limpando..."
	docker stop $NAME 2>/dev/null
	docker stop $NAME 2>/dev/null
	docker rm $NAME 2>/dev/null

# Apagar imagem
	echo "Apagar imagem..."
	docker rmi $IMAGE 2>/dev/null

# Limpar cache de imagens, forcar downloads
	#echo "Apagar imagem em cache"
	#docker image prune -f

# Construir imagem
	docker build -t $IMAGE . || _abort "Erro ao rodar container: $IMAGE"

# Rede de VPSs em containers
	docker network create vpsnet0 -d bridge --subnet 10.80.0.0/24 2>/dev/null
	docker network create vpsnet1 -d bridge --subnet 10.80.1.0/24 2>/dev/null

# Dados persistentes
	# - pasta compartilhada entre todas as VPSs
	SHAREDIR=/tmp/tests/shared
	mkdir -p $SHAREDIR

	# - pasta de dados privados persistentes da VPS
	DATADIR=/tmp/tests/$IMAGE
	mkdir -p $DATADIR

	# - pasta do smokeping
	SMOKEDIR=/tmp/tests/_smokeping/$IMAGE
	mkdir -p $SMOKEDIR/include
	mkdir -p $SMOKEDIR/lib


# Teste
	# - container na rede padrao do docker
	(
	echo '#!/bin/sh'
	echo
    echo docker run -d --restart=always \
        --network vpsnet0 --ip=$IP0 --mac-address $MAC \
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
            $IMAGE $EXTRA_ARGS
    echo 'sn=$?'
    echo '[ "$sn" = "0" ] || exit $sn'
    echo "docker network connect vpsnet1 $NAME --ip=$IP1"
    echo 'sn=$?'
    echo '[ "$sn" = "0" ] || exit $sn'
	echo 'exit 0'
	echo
    ) > /tmp/test-smokeping.sh
    chmod +x /tmp/test-smokeping.sh

    echo
    echo "Script: /tmp/test-smokeping.sh"
    echo

    sh /tmp/test-smokeping.sh || _abort "Erro ao rodar container: $NAME, erro $? ( /tmp/test-smokeping.sh )"

	echo; echo; echo "Container:       $NAME"; echo; echo; echo

exit











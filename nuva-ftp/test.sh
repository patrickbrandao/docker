#!/bin/sh

_abort(){ echo; echo $@; echo; exit 1; }

IMAGE=nuva-ftp
NAME=$IMAGE
LOOPBACK=100.127.255.119
MAC=00:00:01:01:19:00
IPV4=10.91.0.119
IPV6=2001:db8:1091::119
UUID=$(uuid -1)
EXTRA_ARGS="$@"

# Apagar
    echo "#> Apagando"
    # - destruir container
    docker stop "$NAME" 2>/dev/null
    docker stop "$NAME" 2>/dev/null
    docker rm "$NAME" 2>/dev/null
    # - destruir imagem
    if [ "$1" = "fast" ]; then
        # nao destruir imagem pronta
        shift
        EXTRA_ARGS="$@"
    else
        # destruir imagem
        echo "Limpando..."
        docker rmi "$IMAGE"
        docker rmi "$IMAGE"
        docker image prune -f
    fi

# Recriar imagem
    docker build -t $IMAGE . || _abort "Erro ao rodar container: $IMAGE"

# Rede de VPSs em containers
    docker network create ftpnet -d bridge --subnet 10.91.0.0/24 --ipv6 --subnet=2001:db8:1091::/64 --gateway=2001:db8:1091::1 2>/dev/null

# Dados persistentes
    # - pasta FTP
    FTPDIR=/storage/ftp
    mkdir -p $FTPDIR

# Endereco externo
    ADDRESS=$(ip -4 -o ro get 1.2.3.4 | sed 's#.src.#|#g' | cut -f2 -d'|' | awk '{print $1}')

# Teste
  #      
	# - container na rede padrao do docker
	(
	echo '#!/bin/sh'
	echo
    echo docker run -d --restart=always \
        --network ftpnet --ip=$IPV4 --ip6=$IPV6 --mac-address $MAC \
        -h $NAME --name=$NAME \
        \
        --user=root --cap-add=ALL --privileged \
        --env UUID=$UUID \
        --env LOOPBACKS=$LOOPBACK \
        --env ROOT_PASSWORD=tulipa@ftp \
        \
        --env ADDRESS=$ADDRESS \
        --env FTPUSER=patrick \
        --env FTPPASS=tulipa \
        \
        -p 20:20/tcp \
        -p 21:21/tcp \
        -p 21000-21010:21000-21010/tcp \
        \
        --mount type=bind,source=$FTPDIR,destination=/home/ftp,readonly=false \
        \
            $IMAGE $EXTRA_ARGS
    echo 'sn=$?'
    echo '[ "$sn" = "0" ] || exit $sn'
	echo 'exit 0'
	echo
    ) > /tmp/test-ftp.sh
    chmod +x /tmp/test-ftp.sh

    echo
    echo "Script: /tmp/test-ftp.sh"
    echo

    sh /tmp/test-ftp.sh || _abort "Erro ao rodar container: $NAME, erro $? ( /tmp/test-ftp.sh )"

	echo; echo; echo "Container:       $NAME"; echo; echo; echo

exit






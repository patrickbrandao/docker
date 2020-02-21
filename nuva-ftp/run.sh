#!/bin/sh

_abort(){ echo; echo $@; echo; exit 1; }

IMAGE=nuva-ftp
NAME=$IMAGE
LOOPBACK=100.127.255.119
MAC=00:00:01:01:19:00
IPV4=10.97.0.119
IPV6=2001:db8:1097::119
UUID=$(uuid -1)
EXTRA_ARGS="$@"


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
        -h $NAME --name=$NAME \
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
    ) > /tmp/run-ftp.sh
    chmod +x /tmp/run-ftp.sh

    echo
    echo "Script: /tmp/run-ftp.sh"
    echo

    sh /tmp/run-ftp.sh || _abort "Erro ao rodar container: $NAME, erro $? ( /tmp/run-ftp.sh )"

	echo; echo; echo "Container:       $NAME"; echo; echo; echo

exit






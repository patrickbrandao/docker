# docker

Containers em Docker


#### Instalar docker (base debian 9)

```

    # Adicionar repositorio docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

    apt-get -y update
    apt-get -y upgrade
    apt -y autoremove

    apt-get -y install docker-ce
    usermod -aG docker suporte 2>/dev/null
    apt-get -y install docker-compose

    # Comandos rapidos:
    ( echo '#!/bin/sh'; echo; echo 'docker stop $1'; echo 'docker stop $1'; echo 'docker rm $1'; echo; ) > /usr/bin/undocker
    chmod +x /usr/bin/undocker

    ( echo '#!/bin/sh'; echo; echo 'docker exec -it $1 /bin/bash'; echo; ) > /usr/bin/dsh
    chmod +x /usr/bin/dsh

    ( echo '#!/bin/sh'; echo; echo 'docker ps -a'; echo; ) > /usr/bin/dps
    chmod +x /usr/bin/dps

```


#### Baixando repositorio

```

wget https://github.com/patrickbrandao/docker/archive/master.zip -O docker-master.zip
unzip docker-master.zip
cd docker-master

```


#### Alpine pseudo-VPS

Trata-se de um container alpine multiprocessos semelhante a uma VPS em VM

```

# Entre no diretorio alpine-vps
cd alpine-vps/

# Crie a imagem:
docker build -t alpine-vps .

# Rodando container de teste:
docker run --privileged --cap-add=ALL --restart=always -d -h vps-test --name=vps-test alpine-vps

# Entrando no container:
docker exec -it vps-test /bin/bash

# Destruindo container de teste:
docker stop vps-test
docker rm vps-test

# Exemplo: especificar porta de SSH e senha de root:
docker run -d --privileged --cap-add=ALL --restart=always \
        --env ROOT_PASSWORD=tulipa \
        --env SSH_PORT=2222 \
        -h vps-001 --name=vps-001 \
        alpine-vps

```

#### Criando versoes (tags) diferentes

Você não pode criar ou apagar uma imagem da alpine-vps que esteja em uso (containers rodando ou criados).
Se precisar criar alteracoes para novos containers (nao vai afetar os antigos ja rodando),
use o versionamento por tags:

```

# Entre no diretorio alpine-vps
cd alpine-vps/

# Crie a imagem versao 001:
docker build -t alpine-vps:v001 .

#:: Crie a imagem versao 002 (exemplo):
#:: docker build -t alpine-vps:v002 .

# Listar imagens:
docker image ls

# Exemplo: apagar uma imagem pela tag especifica (que nao esteja em uso):
docker rmi alpine-vps:v001
#:: docker rmi alpine-vps:v002

```


#### Aplicacoes all-in-one no pseudo-VPS

##### Nuva-Observium

Container all-in-one para rodar Observium
Requer imagem "alpine-vps" gerada.
Requer download do observium, coloque-o na mesma pasta

```
# Entre na pasta:
cd nuva-observium/

# Baixe o Observium:
wget -c http://www.observium.org/observium-community-latest.tar.gz -O observium-community-latest.tar.gz

# Construa a imagem:
docker build -t nuva-observium .

# Crie um container (porta 80 mapeada na 8080, porta 22 mapeada na 2222):
# - Aceita os mesmos argumentos em ENV da alpine-vps para determinar senha de root, porta de ssh
# - variaveis adicionais:
#    OBSERVIUM_ADMIN_USER: nome de usuario administrador do observium
#    OBSERVIUM_ADMIN_PASSWORD: senha do administrador acima
#    padrao: admin / obs123
#

# Criando Observium simples:
docker run -d --restart=always -h nuva-observium --name=nuva-observium -p 8080:80 -p 2222:22 nuva-observium

# Os dados gerados pelo nuva-observium ficam em:
# - /var/lib/mysql: banco de dados
# - /opt/observium/rrd: dados binarios de graficos RRD
# - /opt/observium/logs: logs de execucao
# ** Monte volume nessas pastas caso deseja destruir o container
#    e preservar os dados
# --mount type=bind,source=/storage/observiun01/rrd,destination=/opt/observium/rrd,readonly=false
# --mount type=bind,source=/storage/observiun01/logs,destination=/opt/observium/logs,readonly=false
# --mount type=bind,source=/storage/observiun01/mariadb,destination=/var/lib/mysql,readonly=false
# 

# Criando Observium de dados persistentes:
mkdir -p /storage/observiun-01/rrd
mkdir -p /storage/observiun-01/logs
mkdir -p /storage/observiun-01/mariadb

docker run -d --restart=always -h nuva-observium-01 --name=nuva-observium-01 \
    -p 8080:80 -p 2222:22 \
    --mount type=bind,source=/storage/observiun-01/rrd,destination=/opt/observium/rrd,readonly=false \
    --mount type=bind,source=/storage/observiun-01/logs,destination=/opt/observium/logs,readonly=false \
    --mount type=bind,source=/storage/observiun-01/mariadb,destination=/var/lib/mysql,readonly=false \
    nuva-observium


```

#### Alpine com Quagga

Trata-se de um container alpine multiprocessos para criar um roteador Linux com Quagga

```

# Entre no diretorio nuva-quagga
cd nuva-quagga/

# Torne os scripts executaveis:
chmod +x rootfs/bin/*
chmod +x rootfs/opt/*
chmod +x rootfs/opt/entrypoints/*

# Crie a imagem:
docker build -t nuva-quagga .

# Rodando container de teste:
docker run --privileged --cap-add=ALL --restart=always -d -h nuva-quagga-01 --name=nuva-quagga-01 nuva-quagga

# Entrando no container:
docker exec -it nuva-quagga-01 /bin/bash

# Destruindo container de teste:
docker stop nuva-quagga-01
docker rm nuva-quagga-01

```


Em breve crio mais...



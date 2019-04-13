# docker

Containers em Docker


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

# Torne os scripts executaveis:
chmod +x rootfs/bin/*
chmod +x rootfs/opt/*
chmod +x rootfs/opt/entrypoints/*

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
docker run -d --privileged --cap-add=ALL --restart=always --env ROOT_PASSWORD=tulipa --env SSH_PORT=2222 -h vps-001 --name=vps-001 alpine-vps

```

#### Criando versoes (tags) diferentes

Você não pode criar ou apagar uma imagem da alpine-vps que esteja em uso (containers rodando ou criados).
Se precisar criar alteracoes para novos containers (nao vai afetar os antigos ja rodando),
use o versionamento por tags:

```

# Entre no diretorio alpine-vps
cd alpine-vps/

# Torne os scripts executaveis:
chmod +x rootfs/bin/*
chmod +x rootfs/opt/*
chmod +x rootfs/opt/entrypoints/*

# Crie a imagem versao 001:
docker build -t alpine-vps:v001 .

# Crie a imagem versao 002:
docker build -t alpine-vps:v002 .

# Listar imagens:
docker image ls

# Exemplo: apagar uma imagem pela tag especifica (que nao esteja em uso):
docker rmi alpine-vps:v001
docker rmi alpine-vps:v002

```


#### Aplicacoes all-in-one no pseudo-VPS

Em breve crio mais...



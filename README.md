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

# Destruindo container:
docker stop vps-test
docker rm vps-test

```

#### Aplicacoes all-in-one no pseudo-VPS

Em breve crio mais...



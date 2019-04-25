#!/bin/sh


# Criando Observium de dados persistentes:
mkdir -p /storage/observiun-01/rrd
mkdir -p /storage/observiun-01/logs
mkdir -p /storage/observiun-01/mariadb
mkdir -p /storage/observium-01/smokeping/include
mkdir -p /storage/observium-01/smokeping/lib


# Criar container persistente:
docker run -d --restart=always -h nuva-observium-01 --name=nuva-observium-01 \
    -p 8080:80 -p 2222:22 \
    --mount type=bind,source=/storage/observiun-01/rrd,destination=/opt/observium/rrd,readonly=false \
    --mount type=bind,source=/storage/observiun-01/logs,destination=/opt/observium/logs,readonly=false \
    --mount type=bind,source=/storage/observiun-01/mariadb,destination=/var/lib/mysql,readonly=false \
    --mount type=bind,source=/storage/observium-01/smokeping/include,destination=/etc/smokeping/include,readonly=false \
    --mount type=bind,source=/storage/observium-01/smokeping/lib,destination=/var/lib/smokeping,readonly=false \
    nuva-observium



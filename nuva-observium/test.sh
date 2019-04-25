#!/bin/sh


# Limpar
	docker stop nuva-observium
	docker stop nuva-observium
	docker rm nuva-observium

	docker rmi nuva-observium
	docker image prune -f

# Construir imagem
	docker build -t nuva-observium .


# Rodar instancia de etste
	docker run -d --restart=always -h nuva-observium --name=nuva-observium -p 8080:80 -p 2222:22 nuva-observium

exit

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



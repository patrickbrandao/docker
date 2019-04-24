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


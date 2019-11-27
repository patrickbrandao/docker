#!/bin/sh

_abort(){ echo; echo $@; echo; exit 1; }

IMAGE=nuva-iperf3

# Construir imagem
	docker build -t $IMAGE . || _abort "Erro ao rodar container: $IMAGE"


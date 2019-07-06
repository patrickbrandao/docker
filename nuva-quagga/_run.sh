#!/bin/sh

image=nuva-quagga


# docker run -d --restart=always -h nuva-quagga-01 --network mth1 --ip 192.168.200.101 --name=nuva-quagga-01 nuva-quagga

#
# Criar containers persistentes
# Lab para muitos vizinhos ospf, rip, bgp, ...
#
for tip in $(seq 101 1 130); do
	name="nuva-quagga-$tip"
	docker run -d --restart=always -h $name --network mth1 --ip 192.168.200.$tip --name=$name $image
done



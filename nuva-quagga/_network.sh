#!/bin/sh

# Criar rede local mac-vlan para contato com o mundo real ou outras VMs

# ens32 - shared network, ligada a wifi/cabo do MacBook
docker network create -d macvlan --subnet=172.21.2.0/24 --gateway=172.21.2.1 -o parent=ens32 mth0

# ens33 - bridge network, vmnet1 do vmware fusion, outras VMs
docker network create -d macvlan --subnet=192.168.200.0/24 --gateway=192.168.200.1 -o parent=ens33 mth1


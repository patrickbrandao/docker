#!/bin/sh


# Apagar todos os containers vpsx1
cidlist=$(docker ps -a | grep nuva-ix-client | awk '{print $1}')
for cid in $cidlist; do docker stop $cid; done
for cid in $cidlist; do docker rm $cid; done


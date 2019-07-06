#!/bin/sh


docker ps | grep nuva-quagga | awk '{print $1}' | while read did; do
	docker stop $did
	docker rm $did
done

docker rmi nuva-quagga


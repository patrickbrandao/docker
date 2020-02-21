#!/bin/sh

	docker stop nuva-ftp
	docker rm nuva-ftp
	docker rmi nuva-ftp
	docker image prune -f


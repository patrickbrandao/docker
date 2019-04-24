#!/bin/sh


	hour=$(date "+%H")
	rest=echo $(($hour%6))

	[ "$rest" = "0" ] || exit 0

	cd /opt/observium || exit 0
	chmod +x /opt/observium/discovery.php

	mkdir -p /var/log/observium
	touch /var/log/observium/discovery-all.log

	/opt/observium/discovery.php -h all 2>/var/log/observium/discovery-all.log 1>/var/log/observium/discovery-all.log



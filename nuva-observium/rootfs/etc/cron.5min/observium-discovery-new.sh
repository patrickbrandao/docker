#!/bin/sh


	cd /opt/observium || exit 0
	chmod +x /opt/observium/discovery.php

	mkdir -p /var/log/observium
	touch /var/log/observium/discovery-new.log

	/opt/observium/discovery.php -h new 2>/var/log/observium/discovery-new.log 1>/var/log/observium/discovery-new.log



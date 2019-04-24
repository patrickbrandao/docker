#!/bin/sh


	cd /opt/observium || exit 0
	chmod +x /opt/observium/housekeeping.php

	mkdir -p /var/log/observium
	touch /var/log/observium/housekeeping.log

	/opt/observium/housekeeping.php -ysel 2>/var/log/observium/housekeeping.log 1>/var/log/observium/housekeeping.log
	/opt/observium/housekeeping.php -yrptb 2>>/var/log/observium/housekeeping.log 1>>/var/log/observium/housekeeping.log


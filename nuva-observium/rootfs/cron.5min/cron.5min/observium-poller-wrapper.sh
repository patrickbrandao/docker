#!/bin/sh


	cd /opt/observium || exit 0
	chmod +x /opt/observium/poller-wrapper.py

	mkdir -p /var/log/observium
	touch /var/log/observium/poller-wrapper.log

	/opt/observium/poller-wrapper.py 4 2>/var/log/observium/poller-wrapper.log 1>/var/log/observium/poller-wrapper.log


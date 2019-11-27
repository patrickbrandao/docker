#!/bin/sh

#
# Configurar servidor IPERF 3
#
# - Supervisor
	for port in 5201 5202 5203 5204 5205 5206 5207 5208 5209; do
		(
			echo "[program:iperf3$port]"
			echo "command=/usr/bin/iperf3 -p $port -s --logfile /var/log/iperf3-$port.log"
			echo 'priority=88'
			echo 'startretries=999999'
			echo 'startsecs=3'
			echo 'stopwaitsecs=3'
			echo 'autostart=true'
			echo 'autorestart=true'
			echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		    echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
		) > /etc/supervisor/iperf3-$port.conf
	done


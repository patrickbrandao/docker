#!/bin/sh

#
# Configurar servidor IPERF - versao 2
#

# - Supervisor
	prio=80
	for port in 5001 5002 5003 5004 5005 5006 5007 5008 5009; do
		prio=$(($prio+1))
		(
			echo "[program:iperf3$port]"
			echo "command=/usr/bin/iperf -p $port -s --output /var/log/iperf2-$port.log"
			echo "priority=$prio"
			echo 'startretries=999999'
			echo 'startsecs=3'
			echo 'stopwaitsecs=3'
			echo 'autostart=true'
			echo 'autorestart=true'
			echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		    echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
		) > /etc/supervisor/iperf2-$port.conf
	done


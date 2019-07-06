#!/bin/sh


# Config padrao
#-----------------------------------------------------------------------

	mkdir -p /etc/quagga
	mkdir -p /var/log/quagga

	chown quagga -R /etc/quagga
	chown quagga -R /var/log/quagga

	cd /etc/quagga/
	touch /etc/quagga/babeld.conf
	touch /etc/quagga/bgpd.conf
	touch /etc/quagga/isisd.conf
	touch /etc/quagga/ospf6d.conf
	touch /etc/quagga/ospfd.conf
	touch /etc/quagga/ripd.conf
	touch /etc/quagga/ripngd.conf
	touch /etc/quagga/vtysh.conf
	touch /etc/quagga/zebra.conf
	(
		echo "zebra=yes"
		echo "bgpd=yes"
		echo "ospfd=yes"
		echo "ospf6d=yes"
		echo "ripd=yes"
		echo "ripngd=yes"
		echo "isisd=yes"
		echo "babeld=yes"
	) > /etc/quagga/daemons

	(
		echo 'vtysh_enable=yes'
		echo 'zebra_options="  --daemon -A 127.0.0.1"'
		echo 'bgpd_options="   --daemon -A 127.0.0.1"'
		echo 'ospfd_options="  --daemon -A 127.0.0.1"'
		echo 'ospf6d_options=" --daemon -A ::1"'
		echo 'ripd_options="   --daemon -A 127.0.0.1"'
		echo 'ripngd_options=" --daemon -A ::1"'
		echo 'isisd_options="  --daemon -A 127.0.0.1"'
		echo 'babeld_options=" --daemon -A 127.0.0.1"'
		echo 'watchquagga_enable=yes'
		echo 'watchquagga_options=(--daemon)'
	) > /etc/quagga/debian.conf

	x=$(grep VTYSH /etc/environment)
	[ "x$x" = "x" ] && echo "VTYSH_PAGER=more" >> /etc/environment

	export VTYSH_PAGER=more
	(
		echo '!'
		echo 'interface lo'
		echo 'ip forwarding'
		echo '!'
		echo 'password zebra'
		echo 'enable password zebra'
		echo 'log file /var/log/quagga/zebra.log'
		echo 'log stdout'
		echo '!'
	) > /etc/quagga/zebra.conf.new

	# Arquivos de config inicial
	for ps in zebra ospfd ospf6d bgpd ripd ripngd isisd babeld; do
		touch /etc/quagga/$ps.conf.new
		[ -f /etc/quagga/$ps.conf ] || mv /etc/quagga/$ps.conf.new /etc/quagga/$ps.conf
	done
	chown quagga:quagga /etc/quagga/*

# Logs
#-----------------------------------------------------------------------

	# Logrotate
	# Rotacionar logs
	touch /etc/logrotate.conf
	egrep 'quagga' /etc/logrotate.conf >/dev/null || {
		echo 'include /etc/logrotate.d/quagga' >> /etc/logrotate.conf
	}	
	mkdir -p /etc/logrotate.d/quagga
	(
		echo '/var/log/quagga/*.log {'
		echo '    rotate 5'
		echo '    daily'
		echo '}'
	) > /etc/logrotate.d/quagga


# Boot
#-----------------------------------------------------------------------

	[ -d /etc/supervisor/conf.d ] || mkdir -p /etc/supervisor/conf.d
	(
		echo '[program:zebra]'
		echo 'command=/usr/sbin/zebra -A 127.0.0.1 -f /etc/quagga/zebra.conf'
		echo 'priority=61'
		echo 'startretries=999999'
		echo 'startsecs=3'
		echo 'stopwaitsecs=3'
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
	) > /etc/supervisor/conf.d/zebra.conf

	(
		echo '[program:bgpd]'
		echo 'command=/usr/sbin/bgpd -A 127.0.0.1 -f /etc/quagga/bgpd.conf'
		echo 'priority=65'
		echo 'startretries=999999'
		echo 'startsecs=9'
		echo 'stopwaitsecs=9'
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
	) > /etc/supervisor/conf.d/bgpd.conf

	(
		echo '[program:ospfd]'
		echo 'command=/usr/sbin/ospfd -A 127.0.0.1 -f /etc/quagga/ospfd.conf'
		echo 'priority=65'
		echo 'startretries=999999'
		echo 'startsecs=9'
		echo 'stopwaitsecs=9'
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
	) > /etc/supervisor/conf.d/ospfd.conf

	(
		echo '[program:ospf6d]'
		echo 'command=/usr/sbin/ospf6d -A ::1 -f /etc/quagga/ospf6d.conf'
		echo 'priority=65'
		echo 'startretries=999999'
		echo 'startsecs=9'
		echo 'stopwaitsecs=9'
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
	) > /etc/supervisor/conf.d/ospf6d.conf


# 
#-----------------------------------------------------------------------








	exit 0
























#!/bin/sh



    [ -d /var/log/supervisor ] || mkdir -p /var/log/supervisor
    [ -d /etc/supervisor/conf.d ] || mkdir -p /etc/supervisor/conf.d
    [ -d /opt/entrypoints ] || mkdir -p /opt/entrypoints

	(
		echo '[linux_supervisor]'
		echo 'file=/var/run/supervisor.sock'
		echo 'chmod=0700'
		echo
		echo '[supervisord]'
		echo 'logfile=/var/log/supervisor/supervisord.log'
		echo 'pidfile=/var/run/supervisord.pid'
		echo 'childlogdir=/var/log/supervisor'
		echo 'nodaemon=true'
		echo
		echo '[rpcinterface:supervisor]'
		echo 'supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface'
		echo
		echo '[supervisorctl]'
		echo 'serverurl=unix:///var/run/supervisor.sock'
		echo
		echo '[include]'
		echo 'files = /etc/supervisor/conf.d/*.conf'
	) > /etc/supervisor/supervisord.conf

    cp /etc/supervisor/supervisord.conf /etc/supervisord.conf



#!/bin/sh


	[ -d /etc/supervisor/conf.d ] || mkdir -p /etc/supervisor/conf.d
	(
		echo '[program:cron]'
		echo 'command=crond -f -L 15'
		echo 'priority=30'
		echo 'startretries=999999'
		echo 'startsecs=3'
		echo 'stopwaitsecs=3'
		echo 'autostart=true'
		echo 'autorestart=true'
		echo 'user=root'
		echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
		echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
	) > /etc/supervisor/conf.d/cron.conf

	mkdir -p /etc/cron.1min
	mkdir -p /etc/cron.5min
	mkdir -p /etc/cron.15min
	mkdir -p /etc/cron.30min
	mkdir -p /etc/cron.hourly
	mkdir -p /etc/cron.daily
	mkdir -p /etc/cron.weekly
	mkdir -p /etc/cron.monthly
	(
		#echo 'SHELL=/bin/sh'
		#echo 'PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin'
		#echo 'MAILTO=""'
		#echo 'USER="root"'
		echo
		echo '# min hour day month weekday command'
		echo '*/1   *    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.1min'
		echo '*/5   *    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.5min'
		echo '*/15  *    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.15min'
		echo '*/30  *    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.30min'
		echo '0     *    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.hourly'
		echo '0     2    *   *     *       /usr/bin/run-parts --regex=. /etc/cron.daily'
		echo '0     3    *   *     6       /usr/bin/run-parts --regex=. /etc/cron.weekly'
		echo '0     5    1   *     *       /usr/bin/run-parts --regex=. /etc/cron.monthly'
		echo
	) > /tmp/crontab.txt
	cat /tmp/crontab.txt | crontab -


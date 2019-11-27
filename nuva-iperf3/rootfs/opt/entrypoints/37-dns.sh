#!/bin/sh

# Funcoes
	_log(){ now=$(date "+%Y-%m-%d-%T"); xlog="$now|dns|$@"; echo "$xlog"; echo "$xlog" >> /var/log/init.log; }

	# Definir servidor DNS para o client resolv local
	servers=$(echo $DNS $NAMESERVER $NAMESERVERS $DNS_IPV4 $DNS_IPV6 | sed 's#,# #g; s#;# #g')
	servers=$(echo $servers)
	[ "x$servers" = "x" ] && exit 0

	# Definir:
	_log "Definindo servidores DNS: [$servers]"
	(
		for dns in $servers; do
			echo "nameserver $dns"
		done
		echo 'options ndots:0'
	) > /etc/resolv.conf

exit 0

#!/bin/sh

# Funcoes
	_log(){ now=$(date "+%Y-%m-%d-%T"); xlog="$now|gateway|$@"; echo "$xlog"; echo "$xlog" >> /var/log/init.log; }

# Alterar gateway padrao do container

	# gateway deve estar ausente
	[ "$GATEWAY" = "none" ] && {
		_log "Gateway none, remover gateway padrao"
		ip -4 route del default 2>/dev/null
		ip -4 route del default 2>/dev/null
		exit 0
	}

	# Gateway informado, mudar:
	echo "$GATEWAY" | egrep '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' >/dev/null && {
		_log "Gateway estatico, remover gateway padrao e definir $GATEWAY"
		gw=$(echo $GATEWAY | cut -f1 -d/)
		ip -4 route del default 2>/dev/null
		ip -4 route del default 2>/dev/null
		ip -4 route add default via $gw proto static metric 250
	}

# Gateway IPv4
	echo "$GATEWAY_IPV4" | egrep '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' >/dev/null && {
		_log "Gateway IPv4 estatico, remover gateway padrao e definir $GATEWAY_IPV4"
		gw=$(echo $GATEWAY_IPV4 | cut -f1 -d/)
		ip -4 route del default 2>/dev/null
		ip -4 route del default 2>/dev/null
		ip -4 route add default via $gw proto static metric 249
	}

# Gateway IPv6
	echo "$GATEWAY_IPV6" | egrep ':' >/dev/null && {
		_log "Gateway IPv6 estatico, remover gateway padrao e definir $GATEWAY_IPV6"
		gw=$(echo $GATEWAY_IPV6 | cut -f1 -d/)
		ip -6 route del default 2>/dev/null
		ip -6 route del default 2>/dev/null
		ip -6 route del 2000::/3 proto static 2>/dev/null
		ip -6 route del 2000::/3 proto static 2>/dev/null
		ip -6 route add default via $gw proto static metric 249
		ip -6 route add 2000::/3 via $gw proto static metric 249
	}

exit 0

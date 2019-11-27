#!/bin/sh

# Funcoes
	_log(){ now=$(date "+%Y-%m-%d-%T"); xlog="$now|loopbacks|$@"; echo "$xlog"; echo "$xlog" >> /var/log/init.log; }


# Definir enderecos aliases na interface loopback
	# Garantir loopbacks nativas
	# - IPv4
	ip -4 addr add 127.0.0.1/8 dev lo scope host 2>/dev/null
	ip -4 route add 127.0.0.0/8 dev lo 2>/dev/null
	# - IPv6
	ip -6 addr add ::1/128 dev lo scope host 2>/dev/null


# Processar lista para garantir /32 ipv4 e /128 ipv6
	tmp=$(echo $LOOPBACK $LOOPBACK_IPV4 $LOOPBACK_IPV6 $LOOPBACKS $LOOPBACKS_IPV4 $LOOPBACKS_IPV6 | sed 's#,# #g')
	tmp=$(echo $tmp)
	_log "Loopbacks: [$tmp]"
	for loaddr in $tmp; do
		addr=$(echo $loaddr | cut -f1 -d/)
		ipv=4; plen=32
		echo "$addr" | egrep ':' >/dev/null && { ipv=6; plen=128; }
		# atribuir na LO
		ip -$ipv addr add $addr/$plen dev lo 2>/dev/null
	done

exit 0


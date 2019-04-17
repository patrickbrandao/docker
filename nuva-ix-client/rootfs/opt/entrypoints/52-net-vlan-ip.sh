#!/bin/sh

#
# Colocar nome nas interfaces de rede eth de
# acordo com o MACADDRESS (que deve ser a eth0 no IX)
#

export PATH="/bin:/sbin:/usr/bin:/usr/sbin"

#--------------------------------------------------------------------------------
myname="net-vlan-ip"
initlogfile="/var/log/init.log"

_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$myname: $@"; echo "$now|$myname: $@" >> $initlogfile; }
_eval(){ _log "Running: $@"; out=$(eval "$@" 2>&1); sn="$?"; _log "Output [$@] = stdno[$sn] stdout[$out]"; }

#--------------------------------------------------------------------------------

_log "Ajustando VLANs e enderecos IPv4 e IPv6"


#--------------------------------------------------------------------------------

	# recarregar os MACs para log
	eth0_mac=$(head -1 /sys/class/net/eth0/address)
	eth1_mac=$(head -1 /sys/class/net/eth1/address)

	ix_dev="eth0"
	[ "$eth1_mac" = "$MACADDRESS" ] && ix_dev=eth1

	docker_dev="eth1"
	[ "$eth1_mac" = "$MACADDRESS" ] && docker_dev=eth0

	_log "Interfaces: eth0 [$eth0_mac] eth1 [$eth1_mac], ix_dev=$ix_dev docker_dev=$docker_dev"

#--------------------------------------------------------------------------------

	# VLANs
	_eval "ip link set up dev $ix_dev"

	# - vlan q-in-q
	MASTER_DEV="$ix_dev"
	[ "$QINQVID" = "0" ] || {
		VDEV="$MASTER_DEV.$QINQVID"
		CMDQINQ="ip link add link $MASTER_DEV $VDEV type vlan proto $$QINQPROTO id $QINQVID"
		_log "VLAN Service presente, q-in-q vid $QINQVID protocol $QINQPROTO, vdev=$VDEV"
		_eval "$CMDQINQ"
		usleep 100000
		_eval "ip link set up dev $VDEV"
		MASTER_DEV="$VDEV"
	}

	# - VLAN IPv4
	IPV4_DEV="$MASTER_DEV"
	[ "$VLAN4" = "0" ] || {
		VDEV4="$MASTER_DEV.$VLAN4"
		CMDVLAN="ip link add link $MASTER_DEV name $VDEV4 type vlan id $VLAN4"
		_log "VLAN IPv4 presente, vid $VLAN4 em $MASTER_DEV, vdev4=$VDEV4"
		_eval "$CMDVLAN"
		usleep 100000
		IPV4_DEV="$VDEV"
		_eval "ip link set up dev $IPV4_DEV"
	}

	# - VLAN IPv6
	IPV6_DEV="$MASTER_DEV"
	[ "$VLAN6" = "0" ] || {
		VDEV6="$MASTER_DEV.$VLAN6"
		CMDVLAN="ip link add link $MASTER_DEV name $VDEV6 type vlan id $VLAN6"
		_log "VLAN IPv6 presente, vid $VLAN6 em $MASTER_DEV, vdev4=$VDEV6"
		_eval "$CMDVLAN"
		usleep 100000
		IPV6_DEV="$VDEV"
		_eval "ip link set up dev $IPV6_DEV"
	}


#--------------------------------------------------------------------------------

	# Definir IP de IX

	# - apagar de interfaces ordinarias
	_log "Removendo rotas e enderecos IPs incorretos"
	(
		ip -4 route del default
		ip -6 route del default
		ip -4 addr del $IPV4_ADDR/$IPV4_BITS dev eth0
		ip -4 addr del $IPV4_ADDR/$IPV4_BITS dev eth1
		ip -6 addr del $IPV6_ADDR/$IPV6_BITS dev eth0
		ip -6 addr del $IPV6_ADDR/$IPV6_BITS dev eth1
	) 2>/dev/null

	# Atribuindo IPs
	CMD1="ip -4 addr add $IPV4_ADDR/$IPV4_BITS dev $IPV4_DEV"
	CMD2="ip -6 addr add $IPV6_ADDR/$IPV6_BITS dev $IPV6_DEV"
	_eval "$CMD1"
	_eval "$CMD2"

#--------------------------------------------------------------------------------

	# Definir gateway via rede docker
	_eval "ip link set up dev $docker_dev"
	tmp=$(ip ro show dev $docker_dev | grep 172.17.0.0/16)
	_log "Docker [$docker_dev] local net: $tmp"
	[ "x$tmp" = "x" ] || {
		CMDGW="ip -4 route add default via 172.17.0.1 dev $docker_dev metric 250"
		_eval "$CMDGW"
	}


#--------------------------------------------------------------------------------

	_log "Ajustes de camada 3 concluidos"


exit 0






















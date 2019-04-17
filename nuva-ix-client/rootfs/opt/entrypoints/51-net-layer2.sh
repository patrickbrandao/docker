#!/bin/sh

#
# Colocar nome nas interfaces de rede eth de
# acordo com o MACADDRESS (que deve ser a eth0 no IX)
#

export PATH="/bin:/sbin:/usr/bin:/usr/sbin"

#--------------------------------------------------------------------------------
myname="net-layer2"
initlogfile="/var/log/init.log"

_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$myname: $@"; echo "$now|$myname: $@" >> $initlogfile; }
_eval(){ _log "Running: $@"; out=$(eval "$@" 2>&1); sn="$?"; _log "Output [$@] = stdno[$sn] stdout[$out]"; }

#--------------------------------------------------------------------------------

_log "Ajustando camada de rede"


# eth0 sempre existe, rede inicial do container
	[ -d /sys/class/net/eth0 ] || { _log "ANOMALIA, eth0 nao encontrada"; sleep 3; }


#--------------------------------------------------------------------------------

	# Aguardar
	# eth1 criada via 'docker network connect', aguarda-la
	tryc=0
	while true; do
		[ -d /sys/class/net/eth1 ] && {
			eth1_mac=$(head -1 /sys/class/net/eth1/address)
			_log "Conexao da eth1 detectada, mac $eth1_mac"
			break
		}
		_log "Aguardando conexao da eth1 a rede docker bridge"
		sleep 3

		# desistir apos 90 segundos
		tryc=$(($tryc+1))
		[ "$tryc" = 30 ] && exit 69
	done

# eth0 e eth1 presentes
	# baixar eth's
	_log "Desativando eth0"
	ip link set down dev eth0; usleep 100000;
	_log "Desativando eth1"
	ip link set down dev eth1; usleep 100000;


#--------------------------------------------------------------------------------

	# Ordenar interfaces de maneira
	# que o MACADDRESS esteja na eth0


	# Verificar quais das interfaces possui o MAC correto
	#      e definir o MAC da incorreta
	eth0_mac=$(head -1 /sys/class/net/eth0/address)
	eth1_mac=$(head -1 /sys/class/net/eth1/address)
	[ "x$eth0_mac" = "x" ] && { _log "ANOMALIA, eth0 sem MAC-ADDRESS"; exit 11; }
	[ "x$eth1_mac" = "x" ] && { _log "ANOMALIA, eth1 sem MAC-ADDRESS"; exit 12; }


	# eth0 = rede de IX
	if [ "$eth0_mac" = "$MACADDRESS" ]; then
		_log "OK, eth0 com mac correto, MACADDRESS=$MACADDRESS eth0_mac=$eth0_mac"
	else
		# verificar se eth1 esta com o MAC da rede IX
		if [ "$eth1_mac" = "$MACADDRESS" ]; then
			_log "SWAPPED, eth1 com mac da rede IX ($MACADDRESS), trocando nomes, eth1_mac=$eth1_mac"
			# trocar nomes de eth0 e eth1
			_log "alternando nome de interfaces"
			ip link set dev eth0 name ethx0; sn1="$?"; usleep 100000;
			ip link set dev eth1 name eth0; sn2="$?"; usleep 100000;
			ip link set dev ethx0 name eth1; sn3="$?"; usleep 100000;
			_log "Interfaces alternadas, sn=$sn1$sn2$sn3"
		else
			_log "ANOMALIA, MACADDRESS ($MACADDRESS) nao encontrado em eth0 [$eth0_mac] nem eth1 [$eth1_mac]";
			exit 70
		fi
	fi

#--------------------------------------------------------------------------------

	# Levantar eth's
	_log "Ativando eth0"
	_eval "ip link set up dev eth0"

	_log "Ativando eth1"
	_eval "ip link set up dev eth1"


	# Inter
	_log "Ajustes de camada 2 concluidos"



exit 0









#!/bin/sh

# Logar invocacao do script
RLOG="/var/log/run-quagga.log"
pid="$$"
_rlog(){ echo "$pid|$@" >> $RLOG; }

soft="$1"
command="$2"

[ "x$soft" = "x" ] && soft=zebra
[ "x$command" = "x" ] && command=service
pname="$command-$soft"

_rlog "$0 $@ || soft=[$soft] command=[$command]"

_stop_watchquagga(){ _rlog "[$pname] Killing watchquagga"; killall watchquagga; killall watchquagga; }
_stop_zebra(){ _rlog "[$pname] Killing zebra"; killall zebra; killall zebra; }
_stop_ospfd(){ _rlog "[$pname] Killing ospfd"; killall ospfd; killall ospfd; }
_stop_ospf6d(){ _rlog "[$pname] Killing ospf6d"; killall ospf6d; killall ospf6d; }
_stop_bgpd(){ _rlog "[$pname] Killing bgpd"; killall bgpd; killall bgpd; }

_start_zebra(){ _rlog "[$pname] Start zebra"; /usr/sbin/zebra -d -A 127.0.0.1 -f /etc/quagga/zebra.conf; }
_start_ospfd(){ _rlog "[$pname] Start ospfd"; /usr/sbin/ospfd -d -A 127.0.0.1 -f /etc/quagga/ospfd.conf; }
_start_ospf6d(){ _rlog "[$pname] Start ospf6d"; /usr/sbin/ospf6d -d -A ::1 -f /etc/quagga/ospf6d.conf; }
_start_bgpd(){ _rlog "[$pname] Start bgpd"; /usr/sbin/bgpd -d -A 127.0.0.1 -f /etc/quagga/bgpd.conf; }

_setup(){
	 mkdir -p /var/log/quagga
	 touch /var/log/quagga/zebra.log
	 chown quagga:quagga /var/log/quagga
	 chown quagga:quagga /var/log/quagga/*
	 chown quagga:quagga $RLOG
}

# Subir e manter
if [ "$command" = "service" ]; then

	# Manter processo pelo watch
	while sleep 5; do
		_rlog "[$pname] Start run-quagga loop"
		# Comando de boot
		_setup
		_stop_watchquagga
		_stop_zebra
		_stop_ospfd
		_stop_ospf6d
		_stop_bgpd

		# Subir servidor zebra
		_start_zebra
		sleep 1

		# Subir clientes
		_start_ospfd
		_start_ospf6d
		_start_bgpd

		_rlog "[$pname] Start watchquagga keeper"
		watchquagga -az \
			-r '/usr/sbin/run-quagga.sh %s restart' \
			-s '/usr/sbin/run-quagga.sh %s start' \
			-k '/usr/sbin/run-quagga.sh %s stop' \
			zebra ospfd ospf6d bgpd
		_rlog "[$pname] watchquagga stopped"
	done
	exit 0
fi

_rlog "[$pname] Command $command soft $soft begin"

# Parar
if [ "$command" = "stop" -o "$command" = "restart" ]; then
	if [ "$soft" = "zebra" ]; then
		_stop_zebra
		_stop_ospfd
		_stop_ospf6d
		_stop_bgpd
	fi
	[ "$soft" = "zebra" ] && _stop_zebra
	[ "$soft" = "ospf" ] && _stop_ospfd
	[ "$soft" = "ospf6" ] && _stop_ospf6d
	[ "$soft" = "bgpd" ] && _stop_bgpd
fi

# Iniciar
if [ "$command" = "start" -o "$command" = "restart" ]; then
	_setup
	if [ "$soft" = "zebra" ]; then
		# pilha inteira
		_start_zebra
		sleep 1
		_start_ospfd
		_start_ospf6d
		_start_bgpd
	else
		# apenas soft preciso
		[ "$soft" = "ospf" ] && _start_ospfd
		[ "$soft" = "ospf6" ] && _start_ospf6d
		[ "$soft" = "bgpd" ] && _start_bgpd
	fi
fi

_rlog "[$pname] Command $command soft $soft end"



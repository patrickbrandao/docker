#!/bin/sh


# Config padrao
#-----------------------------------------------------------------------

    mkdir -p /etc/quagga
    mkdir -p /var/log/quagga
	chown quagga -R /etc/quagga
	chown quagga -R /var/log/quagga

	x=$(grep VTYSH /etc/profile.d/00-env_vars.sh)
	[ "x$x" = "x" ] && echo "VTYSH_PAGER=more" >> /etc/profile.d/00-env_vars.sh	
	export VTYSH_PAGER=more

	# listar interfaces ethernet
	_lseth(){ ls -1 /sys/class/net | grep eth; }
	ethlist=$(_lseth)
	localnet4=$(ip route show proto kernel | awk '{print $1}' | sort -u)

    # Obter IP da eth0 para router-id
    ROUTERID=$(ip a s dev eth0 | grep inet | grep -v inet6 | awk '{print $2}' | cut -f1 -d/)


# Config automatica de LAN - OSPFv2 - IPv4
#-----------------------------------------------------------------------
    (
    	echo "!"
    	n=1 # evitar ECMP e briga por DR entre containers
    	for eth in $ethlist; do
    		echo "interface eth0"
    		echo " ip ospf cost $n"
    		echo " ip ospf mtu-ignore"
    		echo " ip ospf priority $n"
    		echo "!"
    		n=$(($n+1))
    	done
    	echo "router ospf"
    	echo " ospf router-id $ROUTERID"
    	echo " redistribute connected"
    	for net in $localnet4; do
    		echo " network $net area 0.0.0.0"
    	done
    	echo "!"
    	echo "line vty"
    	echo "!"
    ) > /etc/quagga/ospfd.conf

# Config automatica de LAN - OSPFv3 - IPv6
#-----------------------------------------------------------------------
    (
    	echo "!"
    	n=1 # evitar ECMP e briga por DR entre containers
    	for eth in $ethlist; do
    		echo "interface eth0"
    		echo " ipv6 ospf6 network broadcast"
    		echo " ipv6 ospf6 cost $n"
    		echo " ipv6 ospf6 mtu-ignore"
    		echo " ipv6 ospf6 priority $n"
    		echo "!"
    	done
    	echo "router ospf6"
    	echo " router-id $ROUTERID"
    	echo " redistribute connected"
    	echo " interface lo area 0.0.0.0"
    	for eth in $ethlist; do
    		echo " interface $eth area 0.0.0.0"
    	done
    	echo "!"
    	echo "line vty"
    	echo "!"
    ) > /etc/quagga/ospf6d.conf


    # Ajustar permissoes
	chown quagga:quagga /etc/quagga/*


exit 0






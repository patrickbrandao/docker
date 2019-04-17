#!/bin/sh

# Criar config de IX
#-----------------------------------------------------------------------

	mkdir -p /etc/quagga

	mkdir -p /tmp/ixconf
	rm -f /tmp/ixconf/* 2>/dev/null

# IPv4
#-----------------------------------------------------------------------

	# Gerar prefixos
	PR=$(echo $IPV4PREFIX | cut -f1 -d'/')
	P1=$(echo $PR | cut -f1 -d.)
	P2=$(echo $PR | cut -f2 -d.)
	P3=$(echo $PR | cut -f3 -d.)
	A0=$P3
	A1=$(($P3+1))
	A2=$(($P3+2))
	A3=$(($P3+3))

	# Prefixos
	PREFIX4_22="${P1}.${P2}.${A0}.0/22"

	PREFIX4_23a="${P1}.${P2}.${A0}.0/23"
	PREFIX4_23b="${P1}.${P2}.${A2}.0/23"

	PREFIX4_24a="${P1}.${P2}.${A0}.0/24"
	PREFIX4_24b="${P1}.${P2}.${A1}.0/24"
	PREFIX4_24c="${P1}.${P2}.${A2}.0/24"
	PREFIX4_24d="${P1}.${P2}.${A3}.0/24"

	#----------------- Blackhole
	(
		echo "ip route $PREFIX4_22 Null0 250"

		echo "ip route $PREFIX4_23a Null0 250"
		echo "ip route $PREFIX4_23b Null0 250"

		echo "ip route $PREFIX4_24a Null0 250"
		echo "ip route $PREFIX4_24b Null0 250"
		echo "ip route $PREFIX4_24c Null0 250"
		echo "ip route $PREFIX4_24d Null0 250"
	) > /tmp/ixconf/blackhole-ipv4.conf


	#----------------- origin
	ORIGIN4_22="${P1}-${P2}-${A0}m22"

	ORIGIN4_23a="${P1}-${P2}-${A0}m23"
	ORIGIN4_23b="${P1}-${P2}-${A2}m23"

	ORIGIN4_24a="${P1}-${P2}-${A0}m24"
	ORIGIN4_24b="${P1}-${P2}-${A1}m24"
	ORIGIN4_24c="${P1}-${P2}-${A2}m24"
	ORIGIN4_24d="${P1}-${P2}-${A3}m24"
	(
		echo " network $PREFIX4_22 route-map origin-$ORIGIN4_22"

		echo " network $PREFIX4_23a route-map origin-$ORIGIN4_23a"
		echo " network $PREFIX4_23b route-map origin-$ORIGIN4_23b"

		echo " network $PREFIX4_24a route-map origin-$ORIGIN4_24a"
		echo " network $PREFIX4_24b route-map origin-$ORIGIN4_24b"
		echo " network $PREFIX4_24c route-map origin-$ORIGIN4_24c"
		echo " network $PREFIX4_24d route-map origin-$ORIGIN4_24d"
	) > /tmp/ixconf/origin-ipv4.conf
	#----------------- route-map ipv4 origin
	(
		echo "route-map origin-$ORIGIN4_22 permit 10"
		echo " set metric 100"
		echo '!'

		echo "route-map origin-$ORIGIN4_23a permit 10"
		echo " set metric 110"
		echo '!'
		echo "route-map origin-$ORIGIN4_23b permit 10"
		echo " set metric 120"
		echo '!'

		echo "route-map origin-$ORIGIN4_24a permit 10"
		echo " set metric 200"
		echo '!'
		echo "route-map origin-$ORIGIN4_24b permit 10"
		echo " set metric 300"
		echo '!'
		echo "route-map origin-$ORIGIN4_24c permit 10"
		echo " set metric 400"
		echo '!'
		echo "route-map origin-$ORIGIN4_24d permit 10"
		echo " set metric 500"
		echo '!'
	) > /tmp/ixconf/routemap-origin-ipv4.conf



# IPv6
#-----------------------------------------------------------------------



	# Gerar prefixos
	PR=$(echo $IPV6PREFIX | cut -f1 -d'/')
	P1=$(echo $PR | cut -f1 -d:)
	P2=$(echo $PR | cut -f2 -d:)

	# Prefixos
	PREFIX6_32="${P1}:${P2}::/32"

	PREFIX6_33a="${P1}:${P2}::/33"
	PREFIX6_33b="${P1}:${P2}:8000::/33"

	PREFIX6_34a="${P1}:${P2}::/34"
	PREFIX6_34b="${P1}:${P2}:4000::/34"
	PREFIX6_34c="${P1}:${P2}:8000::/34"
	PREFIX6_34d="${P1}:${P2}:c000::/34"

	#----------------- Blackhole
	(
		echo "ipv6 route $PREFIX6_32 Null0 250"

		echo "ipv6 route $PREFIX6_33a Null0 250"
		echo "ipv6 route $PREFIX6_33b Null0 250"

		echo "ipv6 route $PREFIX6_34a Null0 250"
		echo "ipv6 route $PREFIX6_34b Null0 250"
		echo "ipv6 route $PREFIX6_34c Null0 250"
		echo "ipv6 route $PREFIX6_34d Null0 250"
	) > /tmp/ixconf/blackhole-ipv6.conf

	#----------------- origin
	ORIGIN6_32="${P1}-${P2}m32"

	ORIGIN6_33a="${P1}-${P2}-0000m33"
	ORIGIN6_33b="${P1}-${P2}-8000m33"

	ORIGIN6_34a="${P1}-${P2}-0000m34"
	ORIGIN6_34b="${P1}-${P2}-4000m34"
	ORIGIN6_34c="${P1}-${P2}-8000m34"
	ORIGIN6_34d="${P1}-${P2}-c000m34"
	(
		echo " network $PREFIX6_32 route-map origin-$ORIGIN6_32"

		echo " network $PREFIX6_33a route-map origin-$ORIGIN6_33a"
		echo " network $PREFIX6_33b route-map origin-$ORIGIN6_33b"

		echo " network $PREFIX6_34a route-map origin-$ORIGIN6_34a"
		echo " network $PREFIX6_34b route-map origin-$ORIGIN6_34b"
		echo " network $PREFIX6_34c route-map origin-$ORIGIN6_34c"
		echo " network $PREFIX6_34d route-map origin-$ORIGIN6_34d"
	) > /tmp/ixconf/origin-ipv6.conf
	#----------------- route-map ipv4 origin
	(
		echo "route-map origin-$ORIGIN6_32 permit 10"
		echo " set metric 100"
		echo '!'

		echo "route-map origin-$ORIGIN6_33a permit 10"
		echo " set metric 110"
		echo '!'
		echo "route-map origin-$ORIGIN6_33b permit 10"
		echo " set metric 120"
		echo '!'

		echo "route-map origin-$ORIGIN6_34a permit 10"
		echo " set metric 200"
		echo '!'
		echo "route-map origin-$ORIGIN6_34b permit 10"
		echo " set metric 300"
		echo '!'
		echo "route-map origin-$ORIGIN6_34c permit 10"
		echo " set metric 400"
		echo '!'
		echo "route-map origin-$ORIGIN6_34d permit 10"
		echo " set metric 500"
		echo '!'
	) > /tmp/ixconf/routemap-origin-ipv6.conf


#-----------------------------------------------------------------------


	# Gerar config de peerings
	echo -n > /tmp/ixconf/peers-ipv4.conf
	echo -n > /tmp/ixconf/peers-ipv4-activate.conf
	echo -n > /tmp/ixconf/peers-ipv6.conf
	echo -n > /tmp/ixconf/peers-ipv6-activate.conf
	peers=$(echo $PEERINGS | sed 's#/# #g')
	for reg in $peers; do
		peer_id=$(echo $reg | cut -f1 -d';')
		peer_name=$(echo $reg | cut -f2 -d';')
		peer_addr=$(echo $reg | cut -f3 -d';')
		peer_asn=$(echo $reg | cut -f4 -d';')
		peer_type=$(echo $reg | cut -f5 -d';')

		# versao de ip para o arquivo
		peer_file=/tmp/ixconf/peers-ipv4.conf
		peer_actfile=/tmp/ixconf/peers-ipv4-activate.conf
		peer_ipv=4
		echo "$peer_addr" | egrep ':' >/dev/null && {
			peer_file=/tmp/ixconf/peers-ipv6.conf
			peer_actfile=/tmp/ixconf/peers-ipv6-activate.conf
			peer_ipv=6
		}
		echo " neighbor $peer_addr remote-as $peer_asn"  >> $peer_file
		echo " neighbor $peer_addr description '$peer_name'"  >> $peer_file
		echo " neighbor $peer_addr activate" >> $peer_actfile

	done



#-----------------------------------------------------------------------

	# zebra.conf
	(
		echo ''
		echo 'password zebra'
		echo 'enable password zebra'
		echo 'log file /var/log/quagga/zebra.log'
		echo 'log stdout'
		echo '!'
		echo 'interface eth0'
		echo '!'
		echo 'interface eth1'
		echo '!'
		echo 'interface lo'
		echo '!'
		cat /tmp/ixconf/blackhole-ipv4.conf
		echo '!'
		cat /tmp/ixconf/blackhole-ipv6.conf
		echo '!'
		echo 'ip forwarding'
		echo '!'
		echo '!'
		echo 'line vty'
		echo '!'
	) > /etc/quagga/zebra.conf

	# bgpd.conf
	(
		echo '!'
		cat /tmp/ixconf/routemap-origin-ipv4.conf
		cat /tmp/ixconf/routemap-origin-ipv6.conf
		echo '!'
		echo "router bgp $ASN"
		echo " bgp router-id $IPV4_ADDR"
		echo ' no bgp default ipv4-unicast'
		cat /tmp/ixconf/origin-ipv4.conf
		cat /tmp/ixconf/peers-ipv4.conf
		cat /tmp/ixconf/peers-ipv4-activate.conf
		cat /tmp/ixconf/peers-ipv6.conf
		echo ' address-family ipv6'
		cat /tmp/ixconf/origin-ipv6.conf
		cat /tmp/ixconf/peers-ipv6-activate.conf
		#echo ' exit-address-family'
		echo ' exit'
		echo '!'
		echo 'line vty'
		echo '!'
		echo ''
		echo '!'
	) > /etc/quagga/bgpd.conf


#-----------------------------------------------------

	exit 0

























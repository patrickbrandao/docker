#!/bin/sh


# Criar rede no docker para o IX

_abort(){ echo $1; exit $2; }
_ipv4_jump(){
	_ip="$1"
	_jump="$2"
	xip=$(echo $_ip | cut -f1 -d'/')
	ipa=$(echo $xip | cut -f1 -d.)
	ipb=$(echo $xip | cut -f2 -d.)
	ipc=$(echo $xip | cut -f3 -d.)
	ipd=$(echo $xip | cut -f4 -d.)
	for i in $(seq 1 1 $_jump); do
		ipd=$(($ipd+1))
		[ "$ipd" = "256" ] && { ipd=0; ipc=$(($ipc+1)); }
		[ "$ipc" = "256" ] && { ipc=0; ipb=$(($ipb+1)); }
		[ "$ipb" = "256" ] && { ipb=0; ipa=$(($ipa+1)); }
	done
	echo "$ipa.$ipb.$ipc.$ipd"
}

	# Nome do PTT, usado para buscar o arquivo ix-IXNAME.conf
	IXNAME="$1"

	# Driver: padrao bridge
	DRIVER="$2"
	[ "x$DRIVER" = "x" ] && DRIVER="bridge"
	[ "$DRIVER" = "bridge" ] || DRIVER="macvlan"

	# MACVLAN - interface associada
	MACVLANDEV="$3"
	[ "x$MACVLANDEV" = "x" ] && MACVLANDEV="none"


#-------------------------------------------------------------------------------------


# Criticas:
	[ "x$IXNAME" = "x" -o "x$IXNAME" = "x-" ] && IXNAME='ixbr-sp'
	IXCONF="ixconf/$IXNAME.conf"
	[ -f "$IXCONF" ] || _abort "Arquivo de config do IX nao existe: $IXCONF"

	# Nao pode usar macvlan sem especificar a interface
	[ "$DRIVER" = "macvlan" -a "$MACVLANDEV" = "none" ] && _abort "Informe a interface para associar a MACVLAN"


	# Incluir dados do IX
	. $IXCONF


	# Exibir informacoes
	echo "[IX]"
	echo "      IX........................: $IXNAME"
	echo "      IXCONF....................: $IXCONF"
	echo "      IX_PREFIX_IPV4............: $IX_PREFIX_IPV4"
	echo "      IX_PREFIX_IPV6............: $IX_PREFIX_IPV6"
	echo "      IX_VLAN...................: $IX_VLAN"
	echo "      IX_VLAN_IPV4..............: $IX_VLAN_IPV4"
	echo "      IX_VLAN_IPV6..............: $IX_VLAN_IPV6"
	PEERINGS=""
	for reg in $IX_PEERING_LIST; do
	PEERINGS="$PEERINGS/$reg"
	echo "                         peering: $reg"
	done
	echo
	echo "      Docker Network Driver.....: $DRIVER"
	[ "$DRIVER" = "macvlan" ] && \
	echo "      Docker MACVLAN Interface..: $MACVLANDEV"
	echo


	if [ "$DRIVER" = "macvlan" ]; then
		CMD1="docker network create -d $DRIVER --ipv6 --subnet=$IX_PREFIX_IPV4 --subnet=$IX_PREFIX_IPV6 -o parent=$MACVLANDEV $IXNAME"
	else
		CMD1="docker network create -d $DRIVER --ipv6 --subnet=$IX_PREFIX_IPV4 --subnet=$IX_PREFIX_IPV6 $IXNAME"
	fi

	echo
	echo "$CMD1"
	echo
	echo

exit	
IXNAME

#-------------------------------------------------------------------------------------


	# Nome e hostname
	NAME=ixclient-$IXNAME-$SLOT4


	# Pasta compartilhada entre todas as vps
	VPS_SHARED="/storage/shared"
	mkdir -p $VPS_SHARED


	# Argumentos extra
	EXTRA_ARGS=$(echo $5 $6 $7 $8 $9 $10 $11 $12)


#-------------------------------------------------------------------------------------



	# Obter dados do IX esccolhido e gerar dados do participante
	IXCLIENT_ASN=$((260000+$SLOTID))


	# Calcular IPv4
	IXCLIENT_IPV4_ADDR=$(_ipv4_jump "$IX_PREFIX_IPV4" $SLOTID)


	# Calcular IPv6
		T1=$(echo $IXCLIENT_IPV4_ADDR | cut -f1 -d.); T2=$(echo $IXCLIENT_IPV4_ADDR | cut -f2 -d.)
		T3=$(echo $IXCLIENT_IPV4_ADDR | cut -f3 -d.); T4=$(echo $IXCLIENT_IPV4_ADDR | cut -f4 -d.)
		T6=$(echo $IX_PREFIX_IPV6 | sed 's#::#_#' | cut -f1 -d_)
		T7="$T3:$T4"
		[ "x$T3" = "x" ] && T7="$T4"
	IXCLIENT_IPV6_ADDR="$T6::$T7"

	# Gerar MAC
	IXCLIENT_MAC="$MACADDRESS"
	[ "$IXCLIENT_MAC" = "auto"  ] && {
		# - detectar mac de participante real
		# - FALTA FAZER
		# - Usar mac default
		IXCLIENT_MAC="$MACDEF"
	}



#-------------------------------------------------------------------------------------

	# Exibir informacoes
	echo "[IX]"
	echo "      IXCONF....................: $IXCONF"
	echo "      IX_PREFIX_IPV4............: $IX_PREFIX_IPV4"
	echo "      IX_PREFIX_IPV6............: $IX_PREFIX_IPV6"
	echo "      IX_VLAN...................: $IX_VLAN"
	echo "      IX_VLAN_IPV4..............: $IX_VLAN_IPV4"
	echo "      IX_VLAN_IPV6..............: $IX_VLAN_IPV6"
	PEERINGS=""
	for reg in $IX_PEERING_LIST; do
	PEERINGS="$PEERINGS/$reg"
	echo "                         peering: $reg"
	done
	echo

	echo "[IX-CLIENT]"
	echo "      SLOTID....................: $SLOTID / $SLOT4"
	echo "      NAME......................: $NAME"
	echo "      VPS_SHARED................: $VPS_SHARED"
	echo "      IXCLIENT_ASN..............: $IXCLIENT_ASN"
	echo "      IXCLIENT_MAC..............: $IXCLIENT_MAC"
	echo "      IXCLIENT_IPV4_ADDR........: $IXCLIENT_IPV4_ADDR"
	echo "      IXCLIENT_IPV6_ADDR........: $IXCLIENT_IPV6_ADDR"
	echo

exit

#!/bin/sh


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
_ipv4_jump_22(){
	_ip="$1"
	_jump="$2"
	xip=$(echo $_ip | cut -f1 -d'/')
	ipa=$(echo $xip | cut -f1 -d.)
	ipb=$(echo $xip | cut -f2 -d.)
	ipc=$(echo $xip | cut -f3 -d.)
	ipd=0
	for i in $(seq 1 1 $_jump); do
		ipc=$(($ipc+4))
		[ "$ipc" -gt "252" ] && { ipc=0; ipb=$(($ipb+1)); }
		[ "$ipb" -ge "256" ] && { ipb=0; ipa=$(($ipa+1)); }
	done
	echo "$ipa.$ipb.$ipc.$ipd"
}
PROGNAME="$0"
_help(){
	echo
	echo "$PROGNAME: (args)"
	echo
	echo "Args:"
	echo "   --id=ID                  Numero de participante para gerar config"
	echo "   --image=IMG              Nome da imagem para o container"
	echo "   --ix=IXNAME              Nome do IX, definicoes em @IXCONF [ixconf/IXNAME.conf]"
	echo "   --mac=MACADDRESS         Especificar MAC-ADDRESS de participante"
	echo
	echo "Opcoes manuais:"
	echo "   --asn=ASNUMBER           Especificar numero de AS do perticipante, padrao 26000+id"
	echo "   --ipv4=IPV4addr          Especificar endereco IPv4 do participante, padrao ix-ipv4net+id"
	echo "   --ipv6=IPV6addr          Especificar endereco IPv6 do participante, padrao ix-ipv6net+id"
	echo
	echo "   --ipv4prefix=IPV4/22     Prefixo IPv4 associado ao ASN (padrao: x.y.z.0/22)"
	echo "   --ipv6prefix=IPV6/32     Prefixo IPv6 associado ao ASN (padrao: 2008:xyzw::/32)"
	echo
	echo "   --network=DOCKERNET      Nome da rede docker, padrao @IXNAME"
	echo
	echo "   --qinq=VID               ID de vlan Q-in-Q que transporta as vlans de IPv4 e IPv6"
	echo "   --qinqproto=QPROTO       ID hexadecimal de protocolo Q-in-Q (802.1q=0x88A8, 802.1q=0x8100), padrao: 0x88A8"
	echo "   --vlan4=VID              ID de vlan da rede IPv4, padrao do @IXCONF"
	echo "   --vlan6=VID              ID de vlan da rede IPv6, padrao do @IXCONF"
	echo
	exit 1
}

#-------------------------------------------------------------------------------------

# Variaveis padrao
	DEBUG=0
	IMAGE=nuva-ix-client

	# Nome do PTT, usado para buscar o arquivo ixconf/ix-IXNAME.conf
	IXNAME="ix-lab"

	# Numero do participante
	# Usado para obter config automatica e atribuir o nome
	SLOTID="1"

	# Numero de AS do participante
	ASN="auto"

	IPV4PREFIX="auto"
	IPV6PREFIX="auto"

	# Mac-Address de participacao
	MACADDRESS="auto"

	# Endereco IPv4
	IPV4_ADDR="auto"
	IPV6_ADDR="auto"

	# VLAN
	QINQVID=0
	QINQPROTO=802.1ad
	VLAN4="0"
	VLAN6="0"

	# Rede de camada 2 do IX
	DOCKERNETWORK="auto"

	# Modo gerador de coniguracao, sem rodar container persistente
	GENCONF=0

#-------------------------------------------------------------------------------------

# Processar argumentos
	for arg in $@; do
		pn=$(echo "$arg" | cut -f1 -d'=')

		# Analisar argumentos de var/value
		pv=$(echo "$arg" | cut -s -f2 -d'=')
		[ "x$pv" = "x" ] && [ "x$1" = "x" ] && { pv="$1"; }
		# echo "#> ARG: [$arg] 1=[$1] 2[$2] 3[$3] 4[$4] 5[$5] 6[$6] PN=($pn) PV=($pv)"

		# Analisar argumentos solitarios
		# - help
		[ "$pn" = "h" -o "$pn" = "-h" -o "$pn" = "help" -o "$pn" = "-help" -o "$pn" = "--help" ] && _help
		# - debug
		[ "$pn" = "d" -o "$pn" = "-d" -o "$pn" = "debug" -o "$pn" = "-debug" -o "$pn" = "--debug" ] && { DEBUG=1; continue; }
		# - genconf
		[ "$pn" = "g" -o "$pn" = "-g" -o "$pn" = "genconf" -o "$pn" = "-genconf" -o "$pn" = "--genconf" ] && { GENCONF=1; continue; }
		# - verificar se e' nome de IX pre-definido
		tmpcfg="ixconf/$pn.conf"
		[ -f "$tmpcfg" ] && { IXNAME="$pn"; continue; }

		# - ID
		[ "$pn" = "id" -o  "$pn" = "-id" -o "$pn" = "--id" ] && { SLOTID="$pv"; continue; }
		# - asn
		[ "$pn" = "as" -o  "$pn" = "asn" -o "$pn" = "-as" -o "$pn" = "-asn" -o "$pn" = "--as" -o "$pn" = "--asn" ] && { ASN="$pv"; continue; }
		# - ipv4 prefix
		[ "$pn" = "ipv4prefix" -o "$pn" = "-ipv4prefix" -o "$pn" = "-ipv4prefix" -o "$pn" = "--ipv4prefix" ] && { IPV4PREFIX="$pv"; continue; }
		# - ipv6 prefix
		[ "$pn" = "ipv6prefix" -o "$pn" = "-ipv6prefix" -o "$pn" = "-ipv6prefix" -o "$pn" = "--ipv6prefix" ] && { IPV6PREFIX="$pv"; continue; }
		# - mac
		[ "$pn" = "mac" -o  "$pn" = "mac-addr" -o "$pn" = "-mac" -o "$pn" = "-mac-address" -o "$pn" = "--mac" -o "$pn" = "--mac-address" ] && {
			MACADDRESS="$pv"; continue;
		}
		# - ix
		[ "$pn" = "ix" -o  "$pn" = "ixname" -o "$pn" = "-ix" -o "$pn" = "-ix-name" -o "$pn" = "--ix" -o "$pn" = "--ix-name" ] && {
			IXNAME="$pv"; continue;
		}
		# - network name
		[ "$pn" = "net" -o  "$pn" = "network" -o "$pn" = "-net" -o "$pn" = "-network" -o "$pn" = "--net" -o "$pn" = "--network" ] && {
			DOCKERNETWORK="$pv"; continue;
		}
		# - ipv4
		[ "$pn" = "ip4" -o  "$pn" = "ipv4" -o "$pn" = "-ip4" -o "$pn" = "-ipv4" -o "$pn" = "--ip4" -o "$pn" = "--ipv4" ] && {
			IPV4_ADDR="$pv"; continue;
		}
		# - ipv6
		[ "$pn" = "ip6" -o  "$pn" = "ipv6" -o "$pn" = "-ip6" -o "$pn" = "-ipv6" -o "$pn" = "--ip6" -o "$pn" = "--ipv6" ] && {
			IPV6_ADDR="$pv"; continue;
		}
		# - q-in-q vlan - vid da vlan q-in-q
		[ "$pn" = "qinq" -o  "$pn" = "svlan" -o "$pn" = "-qinq" -o "$pn" = "-svlan" -o "$pn" = "--qinq" -o "$pn" = "--svlan" ] && {
			QINQVID="$pv"; continue;
		}
		# - q-in-q vlan - protocolo da vlan q-in-q
		[ "$pn" = "-proto" -o "$pn" = "--proto" -o "$pn" = "-qinq-proto" -o "$pn" = "--qinq-proto" -o "$pn" = "qinq-proto" -o "$pn" = "qinqproto" ] && {
			QINQPROTO="$pv"; continue;
		}
		# - vlan de ipv4
		[ "$pn" = "vid4" -o  "$pn" = "vlan4" -o "$pn" = "-vid4" -o "$pn" = "-vlan4" -o "$pn" = "--vid4" -o "$pn" = "--vlan4" ] && {
			VLAN4="$pv"; continue;
		}
		# - vlan de ipv6
		[ "$pn" = "vid6" -o  "$pn" = "vlan6" -o "$pn" = "-vid6" -o "$pn" = "-vlan6" -o "$pn" = "--vid6" -o "$pn" = "--vlan6" ] && {
			VLAN6="$pv"; continue;
		}
	done

#-------------------------------------------------------------------------------------

# Criticas:
	#*********** validar IX
	[ "x$IXNAME" = "x" -o "x$IXNAME" = "x-" ] && IXNAME='ix-sp'
	IXCONF="ixconf/$IXNAME.conf"
	[ -f "$IXCONF" ] || _abort "Arquivo de config do IX nao existe ($IXNAME): $IXCONF"
	# - Incluir dados do IX
	. $IXCONF

	#*********** validar ID
	echo "$SLOTID" | egrep '^[0-9]+$' >/dev/null || _abort "Informe o ID do participante (--id=nnn), nao-numerico"
	[ "x$SLOTID" = "x" -o "x$SLOTID" = "x-" ] && _abort "Informe o ID do participante (--id=nnn), ausente"
	SLOT4="$SLOTID"
	[ "$SLOTID" -lt 1000 ] && SLOT4="0$SLOTID"
	[ "$SLOTID" -lt 100 ] && SLOT4="00$SLOTID"
	[ "$SLOTID" -lt 10 ] && SLOT4="000$SLOTID"

	#*********** validar rede docker
	# Rede docker
	[ "$DOCKERNETWORK" = "auto" ] && DOCKERNETWORK="$IXNAME"
	[ "x$DOCKERNETWORK" = "x" -o "x$DOCKERNETWORK" = "x-" ] && DOCKERNETWORK="$IXNAME"

	#*********** validar ASN
	# Obter dados do IX esccolhido e gerar dados do participante
	echo "$ASN" | egrep '^[0-9]+$' >/dev/null || _abort "Informe o ASN do participante (--asn=nnn), nao-numerico"
	[ "$ASN" = "auto" ] && ASN=$((260000+$SLOTID))
	[ "x$ASN" = "x" -o "x$ASN" = "x-" ] && _abort "Informe o ASN do participante (--asn=nnn), ausente"

	#*********** validar IPv4
	# Calcular IPv4
	IPV4_BITS=$(echo $IX_PREFIX_IPV4 | cut -f2 -d'/')
	[ "$IPV4_ADDR" = "auto" ] && IPV4_ADDR=$(_ipv4_jump "$IX_PREFIX_IPV4" $SLOTID)
	# - picar ipv4 em partes
		T1=$(echo $IPV4_ADDR | cut -f1 -d.); T2=$(echo $IPV4_ADDR | cut -f2 -d.)
		T3=$(echo $IPV4_ADDR | cut -f3 -d.); T4=$(echo $IPV4_ADDR | cut -f4 -d.)
		tmp_ipv4="198.18.$T3.$T4"

	#*********** validar IPv6
	# Calcular IPv6
	IPV6_BITS=$(echo $IX_PREFIX_IPV6 | cut -f2 -d'/')
	[ "$IPV6_ADDR" = "auto" ] && {
		T6=$(echo $IX_PREFIX_IPV6 | sed 's#::#_#' | cut -f1 -d_)
		T7="$T3:$T4"
		[ "x$T3" = "x" ] && T7="$T4"
		IPV6_ADDR="$T6::$T7"
	}
	tmp_ipv6="2001:db8:198:18::$T3:$T4"

	#*********** validar MAC
	# gerar mac padrao
	P1=$(echo $SLOT4 | cut -b1-2)
	P2=$(echo $SLOT4 | cut -b3-4)
	MACAUTO="00:11:11:11:$P1:$P2"
	[ "$MACADDRESS" = "auto" -o  "x$MACADDRESS" = "x" -o  "x$MACADDRESS" = "x-" ] && MACADDRESS="$MACAUTO"

	#*********** validar prefixo ipv4
	[ "x$IPV4PREFIX" = "x" -o "$IPV4PREFIX" = "auto" ] && {
		IPV4PREFIX=$(_ipv4_jump_22 '45.128.0.0/22' $SLOTID)
		IPV4PREFIX="$IPV4PREFIX/22"
	}

	#*********** validar prefixo ipv4
	[ "x$IPV6PREFIX" = "x" -o "$IPV6PREFIX" = "auto" ] && IPV6PREFIX="2001:$P1$P2::/32"

	#*********** validar Q-IN-Q
	echo "$QINQVID" | egrep '^[0-9]+$' >/dev/null || _abort "Informe o ID de VLAN Q-IN-Q (--qinq=nnn), nao-numerico"

	# q-in-q usando 802.1ad
	[ "$QINQPROTO" = "0x88A8" -o "$QINQPROTO" = "0x88a8" -o "$QINQPROTO" = "88A8" -o "$QINQPROTO" = "88a8" ] && QINQPROTO="802.1ad"
	[ "$QINQPROTO" = "802.1AD" -o "$QINQPROTO" = "802.1ad" -o "$QINQPROTO" = "1ad" -o "$QINQPROTO" = "1AD" ] && QINQPROTO="802.1ad"

	# q-in-q usando double tagging: 802.1q
	[ "$QINQPROTO" = "0x8100" -o "$QINQPROTO" = "8100" ] && QINQPROTO="802.1q"
	[ "$QINQPROTO" = "802.1q" -o "$QINQPROTO" = "802.1Q" -o "$QINQPROTO" = "8021q" ] && QINQPROTO="802.1q"
	[ "$QINQPROTO" = "8021Q" -o "$QINQPROTO" = "1q" -o "$QINQPROTO" = "1Q" ] && QINQPROTO="802.1q"

	# padrao: 1ad
	[ "$QINQPROTO" = "802.1ad" -o "$QINQPROTO" = "802.1q" ] || QINQPROTO="802.1ad"


#-------------------------------------------------------------------------------------

# Variaveis contruidas com os argumentos

	# Nome e hostname
	NAME=ixclient-$IXNAME-$SLOT4

	# Pasta compartilhada entre todas as vps
	VPS_SHARED="/storage/shared"
	mkdir -p $VPS_SHARED


#-------------------------------------------------------------------------------------

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

	echo "[IX-CLIENT]"
	echo "      SLOTID....................: $SLOTID / $SLOT4"
	echo "      IMAGE.....................: $IMAGE"
	echo "      NAME......................: $NAME"
	echo "      VPS_SHARED................: $VPS_SHARED"
	echo "      ASN.......................: $ASN"
	echo "                   IPv4 Prefix..: $IPV4PREFIX"
	echo "                   IPv6 Prefix..: $IPV6PREFIX"
	echo "      MACADDRESS................: $MACADDRESS"	
	echo "      VLANs.....................: q-in-q vid $QINQVID proto $QINQPROTO"
	echo "                     VLAN IPv4..: vlan $VLAN4"
	echo "                     VLAN IPv6..: vlan $VLAN6"
	echo "      IPV4_ADDR.................: $IPV4_ADDR netmask bits $IPV4_BITS"
	echo "      IPV6_ADDR.................: $IPV6_ADDR netmask bits $IPV6_BITS"
	echo "      DOCKERNETWORK.............: $DOCKERNETWORK"
	echo "      GENCONF...................: $GENCONF"
	echo "      DEBUG.....................: $DEBUG"
	echo

	[ "$DEBUG" = "1" ] && exit

#-------------------------------------------------------------------------------------

# Preparar alguns argumentos para o container
	# - se o ipv4 estiver em VLAN, atribuir um ipv4 temporario
	container_ipv4="$IPV4_ADDR"
	[ "$VLAN4" = "0" ] || container_ipv4="$tmp_ipv4"
	
	# - se o ipv6 estiver em VLAN, atribuir um ipv6 temporario
	container_ipv6="$IPV6_ADDR"
	[ "$VLAN6" = "0" ] || container_ipv6="$tmp_ipv6"

#-------------------------------------------------------------------------------------

	CLIOPT=""

	# Parametros gerais
	CLIOPT="$CLIOPT -d"
	CLIOPT="$CLIOPT -h $NAME"
	CLIOPT="$CLIOPT --name=$NAME"
	CLIOPT="$CLIOPT --user=root"
	CLIOPT="$CLIOPT --cap-add=ALL"
	CLIOPT="$CLIOPT --privileged"
	CLIOPT="$CLIOPT --restart=always"
	CLIOPT="$CLIOPT --sysctl net.ipv6.conf.default.disable_ipv6=0"
	CLIOPT="$CLIOPT --sysctl net.ipv6.conf.default.autoconf=0"
	CLIOPT="$CLIOPT --sysctl net.ipv6.conf.default.accept_ra=0"
	CLIOPT="$CLIOPT --sysctl net.ipv6.conf.default.use_tempaddr=1"
	CLIOPT="$CLIOPT --sysctl net.ipv6.conf.default.forwarding=1"

	# Diretorio de dados persistentes
	CLIOPT="$CLIOPT --mount type=bind,source=$VPS_SHARED,destination=/shared,readonly=false"

	# Interface eth0 ligada a rede IX
	CLIOPT="$CLIOPT --network=$DOCKERNETWORK --ip=$container_ipv4 --ip6=$container_ipv6 --mac-address=$MACADDRESS"

	# Variaveis de IX
	CLIOPT="$CLIOPT --env PEERINGS='$PEERINGS'"
	CLIOPT="$CLIOPT --env SLOTID=$SLOTID"
	CLIOPT="$CLIOPT --env SLOT4=$SLOT4"
	CLIOPT="$CLIOPT --env ASN=$ASN"
	CLIOPT="$CLIOPT --env IPV4PREFIX=$IPV4PREFIX"
	CLIOPT="$CLIOPT --env IPV6PREFIX=$IPV6PREFIX"
	CLIOPT="$CLIOPT --env MACADDRESS=$MACADDRESS"
	CLIOPT="$CLIOPT --env IPV4_ADDR=$IPV4_ADDR"
	CLIOPT="$CLIOPT --env IPV4_BITS=$IPV4_BITS"	
	CLIOPT="$CLIOPT --env IPV6_ADDR=$IPV6_ADDR"
	CLIOPT="$CLIOPT --env IPV6_BITS=$IPV6_BITS"
	CLIOPT="$CLIOPT --env QINQPROTO=$QINQPROTO"
	CLIOPT="$CLIOPT --env QINQVID=$QINQVID"
	CLIOPT="$CLIOPT --env VLAN4=$VLAN4"
	CLIOPT="$CLIOPT --env VLAN6=$VLAN6"
	CLIOPT="$CLIOPT --env GENCONF=$GENCONF"

	# repassar demais argumentos para a linha do container
	CLIOPT="$CLIOPT"

	# Comando de criacao:
	cmdrun="docker run $CLIOPT $IMAGE"

	# Comando para dar internet a VPS
	if [ "$DOCKERNETWORK" = "bridge" ]; then
		cmdcon="true"
	else
		cmdcon="docker network connect bridge $NAME"
	fi

# Debug:
	echo
	echo "# Container Run..........:"
	echo
	echo
	echo "$cmdrun"
	echo
	echo
	echo
	echo "#"
	echo "# Connect Run............: "
	echo
	echo
	echo "$cmdcon"
	echo
	echo
	echo
	echo "#"
	echo "# DNS Run................: "
	echo
	echo
	echo "$cmddns"
	echo
	echo
	echo
	echo "#"
	echo

	# Apagar container atual
	echo
	echo -n "#> Parando container existente [$NAME] "
	(docker stop $NAME; docker stop $NAME; docker rm $NAME; docker rm $NAME; ) 2>/dev/null 1>/dev/null
	echo " OK"

	# Criar e rodar container
	echo
	echo "#> Container RUN:"
	eval "$cmdrun" || _abort "Erro $? ao executar $cmdrun"
	echo

	# Conectar a rede CG-NAT
	echo
	echo "#> Container CONNECT:"
	eval "$cmdcon" || _abort "Erro $? ao executar $cmdcon"
	echo




exit




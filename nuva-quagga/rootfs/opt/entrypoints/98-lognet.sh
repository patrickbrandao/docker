#!/bin/sh

#
# Colocar nome nas interfaces de rede eth de
# acordo com o MACADDRESS (que deve ser a eth0 no IX)
#

export PATH="/bin:/sbin:/usr/bin:/usr/sbin"

#--------------------------------------------------------------------------------
myname="lognet"
initlogfile="/var/log/init.log"

_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$myname: $@"; echo "$now|$myname: $@" >> $initlogfile; }
_lognet(){
	now=$(date "+%Y-%m-%d-%T")
	(
		echo "********************* CAMADA DE REDE *********************"
		echo "$now|$myname: LINK:";
		echo;
		ip link show;
		echo;
		echo;

		echo "$now|$myname: IPv4:";
		echo;
		ip -4 addr show;
		echo;
		ip -4 route show;
		echo;

		echo "$now|$myname: IPv6:";
		echo;
		ip -6 addr show;
		echo;
		ip -6 route show;
		echo;
		echo "**********************************************************"
		echo;
	) >> $initlogfile;
}


_lognet



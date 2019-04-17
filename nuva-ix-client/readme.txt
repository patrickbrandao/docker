


# Simulador de clientes em PTTs
#=====================================================



# Preparando:
#-----------------------------------------------------

	# Construa a imagem
	./_make.sh

	# Crie as redes bridge para hospedar os participantes

		# - modo bridge:
		./_create-ix-docker-network.sh ixbr-pttsp
		./_create-ix-docker-network.sh ixbr-pttsp bridge
		./_create-ix-docker-network.sh ix-lab bridge


		# - modo macvlan:
		./_create-ix-docker-network.sh ixbr-pttsp macvlan eth0
		./_create-ix-docker-network.sh ix-lab macvlan eth1





# Criando RS/LGs
#-----------------------------------------------------









# Criando participante
#-----------------------------------------------------


	# Argumentos:
	./_run-ixbr-client.sh help

	# Criando cliente:
	./_run-ixbr-client.sh ix-lab id=930 asn=12345 mac=00:11:22:33:44:55 genconf





#-----------------------------------------------------

!
log file /var/log/quagga/zebra.log
log stdout
!
password zebra
enable password zebra
!
interface eth0
!
interface eth1
!
interface lo
!
router bgp 63981
 bgp router-id 25.0.0.2
 no bgp default ipv4-unicast
 network 45.128.8.0/22 route-map origin-45-128-8-0m22
 network 45.128.8.0/23 route-map origin-45-128-8-0m23
 network 45.128.8.0/24 route-map origin-45-128-8-0m24
 network 45.128.9.0/24 route-map origin-45-128-9-0m24
 network 45.128.10.0/23 route-map origin-45-128-10-0m23
 network 45.128.10.0/24 route-map origin-45-128-10-0m24
 network 45.128.11.0/24 route-map origin-45-128-11-0m24
 neighbor 25.0.0.252 remote-as 9026
 neighbor 25.0.0.252 description IX-LAB-LG1-IPv4
 neighbor 25.0.0.252 activate
 neighbor 25.0.0.253 remote-as 9025
 neighbor 25.0.0.253 description IX-LAB-RS1-IPv4
 neighbor 25.0.0.253 activate
 neighbor 25.0.0.254 remote-as 9025
 neighbor 25.0.0.254 description IX-LAB-RS2-IPv4
 neighbor 25.0.0.254 activate
 neighbor 2001:2500::252 remote-as 9026
 neighbor 2001:2500::252 description IX-LAB-LG1-IPv6
 neighbor 2001:2500::253 remote-as 9025
 neighbor 2001:2500::253 description IX-LAB-RS1-IPv6
 neighbor 2001:2500::254 remote-as 9025
 neighbor 2001:2500::254 description IX-LAB-RS2-IPv6
!
 address-family ipv6
 network 2001:2::/32 route-map origin-2001-0002m32
 network 2001:2::/33 route-map origin-2001-0002-0000m33
 network 2001:2:8000::/33 route-map origin-2001-0002-8000m33
 neighbor 2001:2500::252 activate
 neighbor 2001:2500::253 activate
 neighbor 2001:2500::254 activate
 exit-address-family
 exit
!
ip route 45.128.8.0/22 Null0 250
ip route 45.128.8.0/23 Null0 250
ip route 45.128.8.0/24 Null0 250
ip route 45.128.9.0/24 Null0 250
ip route 45.128.10.0/23 Null0 250
ip route 45.128.10.0/24 Null0 250
ip route 45.128.11.0/24 Null0 250
!
ip forwarding
!
line vty
!
end



#----------------------------------------------------- root@ixclient-ix-lab-0002# cat zebra.conf

!
! Zebra configuration saved from vty
!   2019/04/17 01:05:55
!
password zebra
enable password zebra
log file /var/log/quagga/zebra.log
log stdout
!
interface eth0
!
interface eth1
!
interface lo
!
ip route 45.128.8.0/22 Null0 250
ip route 45.128.8.0/23 Null0 250
ip route 45.128.8.0/24 Null0 250
ip route 45.128.9.0/24 Null0 250
ip route 45.128.10.0/23 Null0 250
ip route 45.128.10.0/24 Null0 250
ip route 45.128.11.0/24 Null0 250
!
ip forwarding
!
!
line vty
!







#----------------------------------------------------- root@ixclient-ix-lab-0002# cat bgpd.conf
!
! Zebra configuration saved from vty
!   2019/04/17 01:05:55
!
!
router bgp 63981
 bgp router-id 25.0.0.2
 no bgp default ipv4-unicast
 network 45.128.8.0/22 route-map origin-45-128-8-0m22
 network 45.128.8.0/23 route-map origin-45-128-8-0m23
 network 45.128.8.0/24 route-map origin-45-128-8-0m24
 network 45.128.9.0/24 route-map origin-45-128-9-0m24
 network 45.128.10.0/23 route-map origin-45-128-10-0m23
 network 45.128.10.0/24 route-map origin-45-128-10-0m24
 network 45.128.11.0/24 route-map origin-45-128-11-0m24
 neighbor 25.0.0.252 remote-as 9026
 neighbor 25.0.0.252 description IX-LAB-LG1-IPv4
 neighbor 25.0.0.252 activate
 neighbor 25.0.0.253 remote-as 9025
 neighbor 25.0.0.253 description IX-LAB-RS1-IPv4
 neighbor 25.0.0.253 activate
 neighbor 25.0.0.254 remote-as 9025
 neighbor 25.0.0.254 description IX-LAB-RS2-IPv4
 neighbor 25.0.0.254 activate
 neighbor 2001:2500::252 remote-as 9026
 neighbor 2001:2500::252 description IX-LAB-LG1-IPv6
 neighbor 2001:2500::253 remote-as 9025
 neighbor 2001:2500::253 description IX-LAB-RS1-IPv6
 neighbor 2001:2500::254 remote-as 9025
 neighbor 2001:2500::254 description IX-LAB-RS2-IPv6
!
 address-family ipv6
 network 2001:2::/32 route-map origin-2001-0002m32
 network 2001:2::/33 route-map origin-2001-0002-0000m33
 network 2001:2:8000::/33 route-map origin-2001-0002-8000m33
 neighbor 2001:2500::252 activate
 neighbor 2001:2500::253 activate
 neighbor 2001:2500::254 activate
 exit-address-family
 exit
!
line vty
!
root@ixclient-ix-lab-0002# 




#-----------------------------------------------------
















































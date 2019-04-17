


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

#!/bin/sh

#
# Configurar servidor SSH
#
# - sshd nao foi instalado, pular
	[ -x /usr/sbin/sshd ] || {
		rm -f /etc/supervisor/sshd.conf 2>/dev/null
		exit 0
	}

# - Diretorios
	[ -d /etc/ssh ] || mkdir -p /etc/ssh
	[ -d /data/ssh ] || mkdir -p /data/ssh
	[ -d /shared/ssh ] || mkdir -p /shared/ssh
	touch /shared/ssh/authorized_keys

# - Porta padrao
	PORT=22
	[ "x$SSH_PORT" = "x" ] || PORT="$SSH_PORT"


# - Preparacao
	[ -d /var/run/sshd ] || mkdir /var/run/sshd
	[ -d /run ] || mkdir /run
	[ -d /data/ssh ] || mkdir /data/ssh

# - Configuracao de servidor
	(
		echo "Port $PORT"
		echo
		echo "HostKey /data/ssh/ssh_host_rsa_key"
		echo "HostKey /data/ssh/ssh_host_ecdsa_key"
		echo "HostKey /data/ssh/ssh_host_ed25519_key"
		echo "AuthorizedKeysFile /shared/ssh/authorized_keys"
		echo
		echo "PidFile /run/sshd.pid"
		echo
		echo "PermitUserEnvironment yes"
		echo
		echo "PermitRootLogin yes"
		echo "PubkeyAuthentication yes"
		echo "PasswordAuthentication yes"
		echo "PermitEmptyPasswords no"
		echo "AllowTcpForwarding no"
		echo "GatewayPorts no"
		echo "X11Forwarding no"
		echo "Compression yes"
		echo "TCPKeepAlive yes"
		echo "ClientAliveInterval 10"
		echo "ClientAliveCountMax 12"
		echo "UseDNS no"
		echo "PermitTunnel no"
		echo "Banner /etc/vps-banner"
		echo "Subsystem sftp /usr/lib/ssh/sftp-server"
	) > /etc/ssh/sshd_config

# Direcionar pasta de usuario ssh
	mkdir -p /data/ssh
	chown root.root /data/ssh
	chmod 700 /data/ssh

	# apontar diretorio .ssh do root para pasta ssh oficial
	rm -rf /root/.ssh 2>/dev/null
	ln -s /data/ssh /root/.ssh


# Link do authorized_keys no caminho padrao
	( cd /root/.ssh && ln -s /shared/ssh/authorized_keys authorized_keys 2>/dev/null )

# - Configuracao de cliente
	(
		echo "Port $PORT"
		echo
		echo "Host *"
		echo "  ForwardAgent no"
		echo "  ForwardX11 no"
		echo "  PasswordAuthentication yes"
		echo "  HostbasedAuthentication no"
		echo "  BatchMode no"
		echo "  CheckHostIP yes"
		echo "  AddressFamily any"
		echo "  ConnectTimeout 0"
		echo
		echo "  StrictHostKeyChecking no"
		echo "  UserKnownHostsFile /data/ssh/known_hosts"
		echo
		echo "  ServerAliveInterval 20"
		echo
		echo "  IdentityFile /data/ssh/id_rsa"
		echo "  IdentityFile /data/ssh/id_dsa"
		echo "  IdentityFile /data/ssh/id_ecdsa"
		echo "  IdentityFile /data/ssh/id_ed25519"
		echo
		echo "  Port 22"
		echo "  Protocol 2"
		echo "  Ciphers aes128-ctr,aes192-ctr,aes256-ctr,aes128-cbc,3des-cbc"
		echo "  MACs hmac-md5,hmac-sha1,umac-64@openssh.com"
		echo "  EscapeChar ~"
		echo "  Tunnel no"
		echo "  TunnelDevice any:any"
		echo "  PermitLocalCommand no"
		echo "  VisualHostKey no"
		echo "  # ProxyCommand ssh -q -W %h:%p gateway.example.com"
		echo "  RekeyLimit 1G 1h"
		echo
	) > /etc/ssh/ssh_config

# Gerar chaves
	ssh-keygen -A
	# Copiar chaves para pasta persistente, sem sobrescrever
	klist="
		ssh_host_dsa_key
		ssh_host_dsa_key.pub
		ssh_host_ecdsa_key
		ssh_host_ecdsa_key.pub
		ssh_host_ed25519_key
		ssh_host_ed25519_key.pub
		ssh_host_rsa_key
		ssh_host_rsa_key.pub
	"
	for shk in $klist; do
		odst="/data/ssh/$shk"
		skey="/etc/ssh/$shk"
		# ja existe armazenada
		if [ -f "$odst" ]; then
			rm $skey 2>/dev/null
			ln -s "$odst" "$skey"
			continue
		fi
		# nao existe no armazenamento, mover e linkar
		cp -ra "$skey" "$odst"
		ln -s "$odst" "$skey"
	done


# Exibir informacoes de VPS ao logar via ssh
	(
		echo '#!/bin/sh'
		echo
		echo 'if [ "$SSH_CONNECTION" ]; then'
		echo '    /bin/vps'
		echo 'fi'
		echo
	) > /etc/profile.d/50-ssh-login.sh
	chmod +x /etc/profile.d/50-ssh-login.sh


exit 0





#========================================================================
#
# Container ALPINE pseudo-VPS
#
#========================================================================

FROM alpine:3.9

MAINTAINER Patrick Brandao <patrickbrandao@gmail.com>
ENV TERM=xterm
ENV TZ=America/Sao_Paulo
ENV PS1='\u@\h\$ '

# Camada: Pacotes
#========================================================================

# Instalar pacotes (criar camada em cache de pacotes alpine)
RUN ( \
	apk --update --no-cache add tini tzdata dcron procps \
	python python2 py-setuptools py-meld3 supervisor \
    coreutils bash readline pwgen lzo sudo tar gzip xz mtr perl \
    wget curl iproute2 sed tcpdump whois fping run-parts bind-tools sshpass \
    openssh-client openssh-keygen openssh-server openssh ca-certificates \
    openssl git mc || exit 11; \
)

# Camada: Arquivos
#========================================================================

# Scripts e arquivos sobrepostos
ADD rootfs/ /

# Ajustar permissoes
RUN ( \
	chmod +x /etc/cron.*/* 2>/dev/null; \
	chmod +x /opt/entrypoints/* 2>/dev/null; \
	chmod +x /opt/entrypoint.sh 2>/dev/null; \
	true;
)

# Ponto de entrada
#========================================================================

ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["/usr/bin/supervisord"]



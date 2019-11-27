#========================================================================
#
# Container ALPINE pseudo-VPS para medidor de rede com Iperf versao 3
# * Roteamento usando quagga
#
#========================================================================

FROM alpine:3.10.2

MAINTAINER Patrick Brandao <patrickbrandao@gmail.com>
ENV TERM=xterm
ENV TZ=America/Sao_Paulo
ENV PS1='\u@\h:\w\$ '

ENV DOMAIN=nuva.com.br

# Camada: Pacotes
#========================================================================

# Instalar pacotes
RUN ( \
    apk --update --no-cache add \
        perl python python2 py-setuptools py-meld3 \
        supervisor \
        tzdata dcron procps \
        coreutils bash readline pwgen lzo sudo util-linux \
        tar gzip xz \
        ca-certificates wget curl \
        mtr iproute2 bind-tools iputils nmap-ncat net-tools \
        sed tcpdump whois fping run-parts logrotate \
        openssl openssh-client openssh-keygen openssh-server openssh rsync \
        mc \
        \
        nginx \
        php7-common php7-fpm php7-json php7-pcntl php7-sockets php7-session \
        \
        net-snmp-libs net-snmp-agent-libs c-ares quagga \
        \
        iperf3 \
        || exit 11; \
)

# Camada: Arquivos
#========================================================================

# Scripts e arquivos sobrepostos
ADD rootfs/ /

# Ajustar permissoes dos scripts
RUN ( \
    chmod +x /etc/cron.*/* 2>/dev/null; \
    chmod +x /bin/*.sh 2>/dev/null; \
    chmod +x /bin/vps 2>/dev/null; \
    chmod +x /usr/bin/*.sh 2>/dev/null; \
    chmod +x /opt/entrypoints/* 2>/dev/null; \
    chmod +x /opt/entrypoint.sh 2>/dev/null; \
    true; \
)

# Ponto de entrada
#========================================================================

ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["/usr/bin/supervisord"]



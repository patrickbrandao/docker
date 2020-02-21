#
#========================================================================
# Alpine & FTP Server
#========================================================================
#
# - Alpine
# - FTP Server
#
#========================================================================
#

FROM alpine:3.11.3
MAINTAINER Patrick Brandao <patrickbrandao@gmail.com>

ENV \
	TERM=xterm \
	TZ=America/Sao_Paulo \
	PS1='\u@\h:\w\$ '

ADD rootfs/ /

RUN ( \
    apk update || exit 11; \
    apk upgrade || exit 12; \
    \
    apk add \
        perl python python2 py-setuptools py-meld3 busybox \
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
        vsftpd \
        \
            || exit 13; \
    \
    chmod +x /etc/cron.*/* 2>/dev/null; \
    chmod +x /bin/*.sh 2>/dev/null; \
    chmod +x /bin/vps 2>/dev/null; \
    chmod +x /usr/bin/*.sh 2>/dev/null; \
    chmod +x /opt/entrypoints/* 2>/dev/null; \
    chmod +x /opt/entrypoint.sh 2>/dev/null; \
    chmod +x /opt/bots/* 2>/dev/null; \
    \
    true; \
)

ENTRYPOINT ["/opt/entrypoint.sh"]
CMD ["/usr/bin/supervisord"]










FROM alpine-vps:latest



# Dados de mariadb
#========================================================================

ENV MARIADB_DATADIR /var/lib/mysql
ENV MARIADB_PIDFILE /run/mariadb/mysqld.pid





# Dados de observium
#========================================================================

ENV OBSERVIUM_DIR /opt/observium
ENV OBSERVIUM_URL http://www.observium.org/observium-community-latest.tar.gz
ENV OBSERVIUM_PKG /opt/observium-community-latest.tar.gz

ENV OBSERVIUM_DB_DATABASE observium
ENV OBSERVIUM_DB_USER observium
ENV OBSERVIUM_DB_PASSWORD observiumsql

# ENV OBSERVIUM_BASE_URL "http://monitoramento.nuva.com.br/"
ENV OBSERVIUM_BASE_URL "/./"

ENV OBSERVIUM_ADMIN_USER admin
ENV OBSERVIUM_ADMIN_PASSWORD obs123




# Preparar ambiente
#========================================================================

RUN ( \
    apk --update --no-cache add \
        py-mysqldb nmap nginx apache2-utils \
        php7 \
        php7-xml php7-xmlrpc php7-xmlreader \
        php7-bcmath php7-intl php7-ctype \
        php7-bz2 php7-zip \
        php7-cgi \
        php7-cli \
        php7-common \
        php7-curl \
        php7-dba \
        php7-dev \
        php7-enchant \
        php7-fpm \
        php7-gd \
        php7-gmp \
        php7-imap \
        php7-json \
        php7-ldap \
        php7-mbstring \
        php7-odbc php7-mysqli php7-sqlite3 php7-mysqlnd \
        php7-opcache \
        php7-pgsql \
        php7-phpdbg \
        php7-pspell \
        php7-recode \
        php7-snmp \
        php7-soap \
        php7-tidy \
        php7-xsl \
        php7-mcrypt \
        php7-session \
        php7-pear php7-pear-mail_mime php7-pear-auth_sasl \
        php7-pear-auth_sasl2 php7-pear-net_socket php7-pear-net_smtp \
        \
        imagemagick graphviz ipmitool rrdtool rrdtool-cached net-snmp net-snmp-tools \
        \
        mariadb mariadb-server-utils mariadb-common mariadb-client || exit 11; \
    mkdir -p /opt/observium; \
)


# Scripts e arquivos sobrepostos
ADD rootfs/ /


# Baixe o observium: http://www.observium.org/observium-community-latest.tar.gz
# e coloque o arquivo observium-community-latest.tar.gz na mesma
# pasta do Dockerfile (este Dockerfile)
ADD observium-community-latest.tar.gz /opt/



# Ajustar permissoes
RUN ( \
    chmod +x /etc/cron.*/* 2>/dev/null; \
    chmod +x /opt/entrypoints/* 2>/dev/null; \
    chmod +x /opt/entrypoint.sh 2>/dev/null; \
    true; \
)





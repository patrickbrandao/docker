#!/bin/sh

export PATH="/sbin:/bin:/usr/sbin:/usr/bin:/usr/local/sbin:/usr/local/bin:/opt/observium"

initlogfile="/var/log/init.log"
_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$@"; echo "$now|$@" >> $initlogfile; }
_logps(){ _log "Process list:"; (echo; ps aux; echo; ) >> $initlogfile; }
_eval(){ _log "Running: $@"; out=$(eval "$@" 2>&1); sn="$?"; _log "Output[$sn]: $out"; }

# Preparar observium
	mkdir -p /opt/observium
    mkdir -p /opt/observium/rrd
    mkdir -p /opt/observium/logs
	cd /opt/observium

	cp config.php.default config.php

	[ "x$OBSERVIUM_DB_USER" = "x" ] || sed -i "s#USERNAME#$OBSERVIUM_DB_USER#" config.php
	[ "x$OBSERVIUM_DB_PASSWORD" = "x" ] || sed -i "s#PASSWORD#$OBSERVIUM_DB_PASSWORD#" config.php

	[ "x$OBSERVIUM_BASE_URL" = "x" ] || egrep base_url config.php 2>/dev/null 1>/dev/null || \
        (echo; echo "\$config[\"base_url\"] = \"$OBSERVIUM_BASE_URL\";"; echo; ) >> config.php

# Script faz tudo inicial, usado para forcar reconstrucao, limpeza, descoberta
    (
        echo '#!/bin/sh'
        echo
        echo "/opt/observium/discovery.php -h all"
        echo "/opt/observium/discovery.php -h new"
        echo "/opt/observium/poller-wrapper.py 4"
        echo "/opt/observium/housekeeping.php -ysel"
        echo "/opt/observium/housekeeping.php -yrptb"
        echo
    ) > /opt/observium/refresh.sh
    chmod +x /opt/observium/refresh.sh


# Logar processos para verificar se o mariadb esta rodando
    _log "Observium: preparando acesso ao MariaDB"
    _logps

# Criar acesso no MariaDB
    CMD1="mysql -u root -e 'CREATE DATABASE $OBSERVIUM_DB_DATABASE DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;'"
    CMD2="mysql -u root -e 'GRANT ALL PRIVILEGES ON $OBSERVIUM_DB_DATABASE.* TO \"$OBSERVIUM_DB_USER\"@\"localhost\" IDENTIFIED BY \"$OBSERVIUM_DB_PASSWORD\"';"
    _eval "$CMD1"
    _eval "$CMD2"

    cd /opt/observium

    _log "Observium: rodando discovery..."
    ./discovery.php -u
    
    _log "Observium: rodando discovery all..."
    ./discovery.php -h all
    
    _log "Observium: rodando poller..."
    ./poller.php -h all

    _log "Observium: criando acesso $OBSERVIUM_ADMIN_USER / $OBSERVIUM_ADMIN_PASSWORD"
    CMD3="./adduser.php '$OBSERVIUM_ADMIN_USER' '$OBSERVIUM_ADMIN_PASSWORD' 10"
    #./adduser.php "$OBSERVIUM_ADMIN_USER" "$OBSERVIUM_ADMIN_PASSWORD" 10
    _eval "$CMD3"

    _log "Observium: ajustando permissoes..."
    mkdir -p /opt/observium/rrd
    mkdir -p /opt/observium/logs
    chown nginx.nginx /opt/observium/logs -R
    chown nginx.nginx /opt/observium/rrd -R
    chown nginx.nginx /opt/observium/logs -R
    chown nginx.nginx /opt/observium/*




exit 0



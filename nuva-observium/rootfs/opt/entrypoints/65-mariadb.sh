#!/bin/sh


initlogfile="/var/log/init.log"
_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$@"; echo "$now|$@" >> $initlogfile; }
_eval(){ _log "Running: $@"; out=$(eval "$@" 2>&1); sn="$?"; _log "Output[$sn]: $out"; }
_logps(){ _log "Process list:"; (echo; ps aux; echo; ) >> $initlogfile; }


# Preparar mariadb para execucao

	[ "x$MARIADB_DATADIR" = "x" ] && {
		MARIADB_DATADIR=/var/lib/mysql
		export MARIADB_DATADIR=/var/lib/mysql
	}

	_log "Mariadb: Iniciando preparacao, datadir=$MARIADB_DATADIR"

	mkdir -p /run/mariadb
	chown mysql.mysql /run/mariadb

	mkdir -p $MARIADB_DATADIR
	chown mysql.mysql $MARIADB_DATADIR


# Instalar banco de dados inicial
    _idb=0
    [ -d "$MARIADB_DATADIR/mysql" ] || _idb=1
    [ -d "$MARIADB_DATADIR/test" ] || _idb=2
    [ "$_idb" = "0" ] || {
    	CMD="/usr/bin/mysql_install_db --user=mysql --datadir=$MARIADB_DATADIR"
   		_log "Mariadb: Instalando base de dados inicial, $CMD"
   		_eval "$CMD"
    }

    # Garantir permissao das bases de dados
    _log "Mariadb: Garantindo permissoes em $MARIADB_DATADIR/*"
    chown -R mysql.mysql $MARIADB_DATADIR/

    chown mysql.mysql $MARIADB_DATADIR/*
    chown mysql.mysql $MARIADB_DATADIR/mysql
    chown mysql.mysql $MARIADB_DATADIR/mysql/*

# Rodar mariadb
	_log "Mariadb: Iniciando instancia"
	( ( /usr/bin/mysqld_safe --datadir=$MARIADB_DATADIR --pid-file=$MARIADB_PIDFILE ) 2>/dev/null 1>/dev/null & )

    # Aguardar alguns segundos pelo boot
    for i in 1 2 3 4 5; do
        mysql -uroot -e 'show processlist' 2>/dev/null 1>/dev/null
        [ "$?" = "0" ] && break
        sleep 1
    done
    _eval "mysql -uroot -e 'show processlist'"


# Servico no supervisor
	mkdir -p /etc/supervisor/conf.d
    ( echo '[program:mariadb]'; \
        echo "command=/usr/bin/mysqld_safe --datadir=$MARIADB_DATADIR --pid-file=$MARIADB_PIDFILE"; \
        echo 'autostart=true'; \
        echo 'autorestart=true'; \
        echo 'priority=20'
		echo 'startretries=999999'; \
		echo 'startsecs=3'; \
		echo 'stopwaitsecs=3'; \
        echo 'user=root'
        echo 'stdout_logfile=/var/log/supervisor/%(program_name)s.log'
        echo 'stderr_logfile=/var/log/supervisor/%(program_name)s.err'
    ) > /etc/supervisor/conf.d/mariadb.conf; \


# Logar processos em execucao para verificar se o MARIADB esta rodando
    _logps




exit 0





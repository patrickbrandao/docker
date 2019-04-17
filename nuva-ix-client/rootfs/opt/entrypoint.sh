#!/bin/sh

EXEC_CMD="$@"

# Funcoes
#========================================================================================================

initlogfile="/var/log/init.log"
_log(){ now=$(date "+%Y-%m-%d-%T"); echo "$now|$@"; echo "$now|$@" >> $initlogfile; }
_eval(){ _log "Running: $@"; out=$(eval "$@" 2>&1); sn="$?"; _log "Output[$sn]: $out"; }

#========================================================================================================


# Fazer instalacao da base inicial
_init_setup(){
	_log "INIT-SETUP"
  #
	# Codigo manual de setup aqui.
  #
	_log "END-SETUP"
}

# Scripts de ponto de entrada
_init_entrypoints(){
	_log "INIT-ENTRYPOINTS"

	cd /opt/entrypoints || return 9
	for escript in *.sh; do
		_log "Entrypoint script: start [$escript]"
		sh $escript
		sn="$?"
		_log "Entrypoint script: stdno [$escript] = $sn"
	done

	_log "END-ENTRYPOINTS"
}

#========================================================================================================

_log "Start entrypoint [$0 $@] cmd $EXEC_CMD"

_init_setup
_init_entrypoints

# Rodar CMD
_log "Start CMD: $EXEC_CMD"
exec "$EXEC_CMD"



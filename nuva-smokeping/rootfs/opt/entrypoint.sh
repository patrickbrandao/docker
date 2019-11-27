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
  
	# Senha de root
	if [ -x /usr/sbin/chpasswd ]; then
		# Definir senha de root
		[ "x$ROOT_PASSWORD" = "x" ] || {
			echo "root:${ROOT_PASSWORD}" | chpasswd 2>/dev/null 1>/dev/null;
		}
		# Apagar variavel de ambiente
		unset ROOT_PASSWORD
		export ROOT_PASSWORD=""
	fi

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

# Incluir variaveis de ambiente efetivadas
[ -x /bin/env.sh ] && _log "Include previous env vars from: [/etc/env.d] -> /bin/env.sh"
[ -x /bin/env.sh ] && . /bin/env.sh

# Instalar
_log "Start setup"
_init_setup

# Executar scripts de entrypoint
_log "Start entrypoints"
_init_entrypoints

# Incluir variaveis de ambiente efetivadas
[ -x /bin/env.sh ] && _log "Include current env vars from: [/etc/env.d] -> /bin/env.sh"
[ -x /bin/env.sh ] && . /bin/env.sh

# Rodar CMD
if [ "x$EXEC_CMD" = "x" ]; then
    _log "Start default CMD: [sleep 252288000]"
	exec "sleep" "252288000"
	stdno="$?"
else
	_log "Start CMD: [$EXEC_CMD]"
	exec "$EXEC_CMD"
	stdno="$?"
fi

exit $stdno




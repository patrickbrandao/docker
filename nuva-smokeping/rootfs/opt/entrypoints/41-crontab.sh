#!/bin/sh

# Rodar agendadores armazenados
# em pasta privada e em pasta compartilhada
# Use: https://crontab.guru/every-weekday

	# Diretorios
	# - Local do diretorio de scripts
	[ -d /etc/cron ] || mkdir -p /etc/cron

	# - Diretorio privado montado
	[ -d /data/cron ] || mkdir -p /data/cron

	# - Diretorio compartilhado montado
	[ -d /shared/cron ] || mkdir -p /shared/cron

	# Links para compatibilidade anterior
	_cron_private_dir(){
		ctimer="$1"
		# :: Diretorio real
		d1="/data/cron/$ctimer"
		# :: Diretorio de compatibilidade Slackmini
		d2="/etc/cron.$ctimer"; d3="/etc/cron/$ctimer"
		# - diretorio oficial
		[ -d "$d1" ] || mkdir -p "$d1"
		# - link para formatos antigos
		[ -d "$d2" ] || { rm -f "$d2" 2>/dev/null; ln -s "$d1" "$d2"; }
		[ -d "$d3" ] || { rm -f "$d3" 2>/dev/null; ln -s "$d1" "$d3"; }		
	}
	_cron_public_dir(){
		ctimer="$1"
		# :: Diretorio real
		d1="/shared/cron/$ctimer"
		[ -d "$d1" ] || mkdir -p "$d1"
	}

	# Lista de diretorios para os agendamentos
	# de execucao
	dirlist="
		1min 2min 5min 15min 30min
		hourly daily weekly monthly
		sunday monday tuesday wednesday thursday friday saturday
	"

	# Agendadores privados
	for cdir in $dirlist; do _cron_private_dir $cdir; done

	# Agendadores compartilhados
	for cdir in $dirlist; do _cron_public_dir $cdir; done


#!/bin/sh


# Definir senha de root
[ "x$ROOT_PASSWORD" = "x" ] || {
	echo "root:${ROOT_PASSWORD}" | chpasswd 2>/dev/null 1>/dev/null;
}

# Apagar variavel de ambiente
unset ROOT_PASSWORD
export ROOT_PASSWORD=""


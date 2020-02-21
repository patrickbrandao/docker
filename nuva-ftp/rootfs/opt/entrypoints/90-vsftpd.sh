#!/bin/sh



# Remover usuarios FTP
    deluser ftp 2>/dev/null 1>/dev/null


# Variaveis
    FTPUSER=${FTPUSER:-"ftpu"}
    FTPPASS=${FTPPASS:-"tulipa@ftp"}
    FTPHOME="/home/ftp"

    # garantir diretorio
    mkdir -p "$FTPHOME" 2>/dev/null


    # criar usuario
    adduser -D -h $FTPHOME $FTPUSER 2>/dev/null

    # definir senha do usuario
    echo "$FTPUSER:$FTPPASS" | chpasswd 2>/dev/null 1>/dev/null

    # dar permissao na pasta ao usuario
    chown $FTPUSER:$FTPUSER $FTPHOME


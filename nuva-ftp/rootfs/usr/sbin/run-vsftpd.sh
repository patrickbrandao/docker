#!/bin/sh

# Controle de IP passivo enviado ao cliente
    OIP=$(ip -4 -o ro get 1.2.3.4 | sed 's#.src.#|#g' | cut -f2 -d'|' | awk '{print $1}')
    ADDRESS=${ADDRESS:-"$LOOPBACK"}
    ADDRESS=${ADDRESS:-"$OIP"}
    ADDR_OPT="-opasv_address=$ADDRESS"

# Rodar:
    echo "/usr/sbin/vsftpd -opasv_min_port=21010 -opasv_max_port=21010 $ADDR_OPT /etc/vsftpd/vsftpd.conf"
    /usr/sbin/vsftpd -opasv_min_port=21010 -opasv_max_port=21010 $ADDR_OPT /etc/vsftpd/vsftpd.conf


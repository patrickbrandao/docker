#!/bin/sh

ex=$(ps ax | egrep poller-wrapper | egrep -v grep)
[ "x$ex" = "x" ] || exit 0

# Rodar
/usr/bin/python /opt/observium/poller-wrapper.py -w 4



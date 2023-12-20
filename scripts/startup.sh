#! /bin/bash

PATH_DB_SERVER='./../bancodedados/banco.py'
PATH_WEBSOCKET='./../servidorDialogo/servidor_websocket_python/servidor.py'

python3 $PATH_WEBSOCKET & 
python3 $PATH_DB_SERVER & 
wait
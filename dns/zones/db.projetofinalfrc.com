;
; BIND data file for projetofinal
;
$TTL    604800
@       IN      SOA     projetofinalfrc.com. root.projetofinalfrc.com. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      localhost.
www       IN      A       10.0.0.1
@       IN      A       10.0.0.1

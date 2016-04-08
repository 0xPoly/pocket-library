#!/bin/ash

if [ "$REQUEST_METHOD" = "POST" ]; then
    # junk
    read
    read
    read

    # field that contains password
    read fourth

    # Strip newline that some browsers add
    fourth=`echo -n $fourth | tr -d "\r\n"`

    # Change password - chpasswd, etc don't work
    (echo $fourth; sleep 1; echo $fourth ) | passwd

    echo "Status-Code: 204"
    echo

    # restarting webserved needed for change to take effect
    /etc/init.d/uhttpd restart


    # Once passwd is set, move this file into password
    # protected directory and self destruct
    head -n -8 "/www/cgi-bin/set-password.sh" > "/www/cgi-bin/admin/change-password.sh"
    tail -1 "/www/cgi-bin/set-password.sh" >> "/www/cgi-bin/admin/change-password.sh"
    chmod +x /www/cgi-bin/admin/change-password.sh
    rm "/www/cgi-bin/set-password.sh"

    echo "Status-Code: 204"
    echo
fi

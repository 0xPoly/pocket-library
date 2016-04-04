#!/bin/ash

# junk
read
read
read

#important bits
read fourth

fourth=`echo -n $fourth | tr -d "\r\n"`

(echo $fourth; sleep 1; echo $fourth) | passwd testuser

# Once passwd is set, move this file into password
# protected directory and self destruct
head -n -4 "/www/cgi-bin/set-password.sh" > "/www/cgi-bin/admin/change-password.sh"
chmod +x /www/cgi-bin/admin/change-password.sh
rm "/www/cgi-bin/set-password.sh"


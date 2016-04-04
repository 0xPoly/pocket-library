#!/bin/ash

# junk
read
read
read

#important bits
read fourth

fourth=`echo -n $fourth | tr -d "\r\n"`

mv "/mnt/usb/approve/$fourth" "/mnt/usb/$fourth"

echo "Status-Code: 204"
echo

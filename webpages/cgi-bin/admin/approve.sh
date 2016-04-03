#!/bin/ash

read first
read second
read third
read fourth

fourth=`echo -n $fourth | tr -d "\r\n"`

mv "/mnt/usb/approve/$fourth" "/mnt/usb/$fourth"

echo "Status-Code: 204"
echo

#!/bin/ash

# junk, headers, etc
read
read
read
# important line
read fourth

fourth=`echo -n $fourth | tr -d "\r\n"`

rm "/mnt/usb/$fourth"

echo "Status-Code: 204"
echo

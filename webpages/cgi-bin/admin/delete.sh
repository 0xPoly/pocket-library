#!/bin/ash

# junk, headers, etc
read first
read second
read third
read fourth

fourth=`echo -n $fourth | tr -d "\r\n"`

rm "/mnt/usb/$fourth"

echo "Status-Code: 204"
echo

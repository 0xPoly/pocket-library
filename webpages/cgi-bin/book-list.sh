#!/bin/ash

echo 'Cache-Control: no-cache, no-store, must-revalidate'
echo 'Pragma: no-cache'
echo 'Expires: 0'
echo 'Content-type: text/plain'
echo ''

ls /mnt/usb/

exit 0

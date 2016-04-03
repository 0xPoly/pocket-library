#!/bin/ash

echo "Content-type: text/plain"
echo ""

if [ -f /etc/approval-needed ];
then
    # upload approval needed
    echo "1"
else
    # aproval not needed
    echo "0"
fi


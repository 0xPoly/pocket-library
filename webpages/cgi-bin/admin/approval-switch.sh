#!/bin/ash

if [ -f /etc/approval-needed ];
then
    rm /etc/approval-needed
else
    touch /etc/approval-needed
fi

echo "Status-code: 204"
echo ""


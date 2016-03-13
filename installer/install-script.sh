#!/bin/ash
DIR=`dirname $0`
echo "Setting up web server"

rm -r /etc/config/uhttpd
cp "$DIR/uhttpd" /etc/config/uhttpd

echo "Installing webpages"

rm -rf /www/*
cp -r "$DIR/webserver/"* /www

# restart webserver
/etc/init.d/uhttpd restart

echo "Configuring wireless"

# Regenerate Configuration
rm -f /etc/config/wireless
wifi detect > /etc/config/wireless

# Enable wireless, create backup of original config
sed -i.bak '/option disabled 1/d' /etc/config/wireless

# Change AP name to 'Pocket Library'. 
# [[:space:]] works on more systems than \s 
sed -i -E "s/option[[:space:]]+ssid[[:space:]]+OpenWrt/option ssid 'Pocket Library'/ig" /etc/config/wireless

# Restart wifi
wifi

echo "Setting up DHCP"
rm -f /etc/config/dhcp
cp "$DIR/dhcp" /etc/config/dhcp

echo "Redirecting all traffic to library page"
cp "$DIR/dnsmasq.conf" /etc/dnsmasq.conf

# Restart dnsmasq
/etc/init.d/dnsmasq restart

echo "Pocket Library setup complete"

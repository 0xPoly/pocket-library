#!/bin/ash


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

echo "Pocket Library setup complete"

image_URL=https://downloads.openwrt.org/chaos_calmer/15.05/ar71xx/generic/OpenWrt-ImageBuilder-15.05-ar71xx-generic.Linux-x86_64.tar.bz2
# Find the list of profiles here: http://pastebin.com/WbudpBDJ
profile=TLMR3020
packages="uhttpd dnsmasq kmod-usb-storage block-mount kmod-fs-vfat kmod-nls-cp437 kmod-nls-iso8859-1 -luci -ppp -ppp-mod-pppoe -lua"
FILES_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))"/files"



all: get-frimware image

get-frimware:
	mkdir -p build/openwrt && cd build/openwrt && \
	curl -O $(image_URL) && \
	tar -xjf OpenWrt*

image:
	mkdir files/www
	cp -r webpages/* files/www
	cd build/openwrt/OpenWrt* && \
	make image PROFILE=$(profile) PACKAGES=$(packages) FILES=$(FILES_DIR)
	rm -rf files/www

clean:
	rm -rf build/
	rm -rf files/www

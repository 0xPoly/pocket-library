packages="uhttpd dnsmasq kmod-usb-storage block-mount kmod-fs-vfat kmod-nls-cp437 kmod-nls-iso8859-1 coreutils-csplit -luci -ppp -ppp-mod-pppoe -lua"
FILES_DIR:=$(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))"/files"

URL=https://downloads.openwrt.org/chaos_calmer/15.05/${ARCH}/generic/OpenWrt-ImageBuilder-15.05-${ARCH}-generic.Linux-x86_64.tar.bz2

all: download build_image

download:
	mkdir -p build/openwrt && cd build/openwrt && \
	curl -O ${URL} && \
	tar -xjf OpenWrt*

build_image:
	mkdir -p files/www
	cp -r webpages/* files/www
	cd build/openwrt/OpenWrt* && \
	make image PROFILE=${TARGET} PACKAGES=${packages} FILES=${FILES_DIR}
	rm -rf files/www

clean:
	rm -rf build/
	rm -rf files/www

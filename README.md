Pocket Library
==============
Share books from anywhere! Pocket Library is a lightweight portable library designed to run on
OpenWrt devices. **Still in development. Don't actually run this!**

![screenshot](screenshot.png)

Features:

 * **Share books with ease** - Pocket Library allows anyone in WiFi range to download books
 * **Find books quickly** - Search allows you locate uploaded books quickly
 * **Contribute your favorite books** - Users can upload their own books to the library for sharing
 * **Take your books with you** - Install on a portable router for sharing books on the road
 * **Be in control** - Choose whether books uploaded to the library need to be approved
 * **Easy insallation** - Simply flash the Pocket Library image and plug in a USB drive

## Installation
There are two methods for installation. The first method is the easiest, but is only compatible
with the following devices:

* [TP-Link TRM3020](some link)
* [TP-Link XXX](some link)

If your device is one of these, follow [this visual guide]() to get Pocket Library quickly 
up and running.

### Generating Pokcet Library Images
Device not on the list? No worries. Please note that this method requires basic familiarty with
OpenWRT (or any custom router frimware) and the linux command line.

First, use [this page](https://wiki.openwrt.org/toh/start) to find the OpenWRT codename for your device. 
For example, to find the code name for the TP-Link MR3020, type `MR3020` into the model search
field. The corresponding device page is `tl-mr3020`. This is the codename for your device, 
note it somewhere.


Open the command line and clone this repository:

    git clone --depth 1 https://github.com/0xPoly/pocket-library.git

Next, download and build the image:

    make all PL_MODEL=tl-mr3020

If all goes well, you should have an image located in XXX.

## Contribute
Familiar with OpenWrt and want to help out with Pocket Library? Follow the installation
instructions for "the hard way" and contact us. I'll gladly help with troublshooting 
devices so that we can add them to the "confirmed working" list above.


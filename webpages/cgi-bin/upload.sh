#!/bin/ash

case "$REQUEST_METHOD" in
  POST)
    (
        # Discard first four lines
        read && read && read && read &&

        # Read and echo, buffering two lines
        read line1 &&
        read line2 &&
        while read nextline ; do
            echo "$line1"
            line1="$line2"
            line2="$nextline"
        done

        # Echo penultimate line with no trailing newline.
        echo -n "$line1"

        # Discard last line ($line2)
    ) > /mnt/usb/new_book.pdf

    echo 'Status: 204 No Content'
    echo
    ;;

  *)
    echo 'Status: 405 Method Not Allowed'
    echo
esac

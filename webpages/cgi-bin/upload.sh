#!/bin/ash
echo "Content-Type: text/plain"
echo

if [ "$REQUEST_METHOD" = "POST" ]; then
    TMPOUT=/mnt/usb/
    # Random filename prefix to allow for simultaneous uploads
    TMPOUT=$TMPOUT`</dev/urandom tr -dc 0-9 | dd bs=6 count=1 2>/dev/null | sed -e 's/^0\+//'`
    cat >$TMPOUT

    # Split into 5 files:
    # [RANDOM]1, containing the PDF
    # [RANDOM]2, containing the PDF name
    # [RANDOM]3, containing the PDF cover PNG
    # [RANDOM]0 and [RANDOM]4, junk
    csplit --digits=1  --quiet --prefix=$TMPOUT $TMPOUT "/------WebKitFormBoundary/" "{*}"
    
    rm $TMPOUT"0"
    rm $TMPOUT"4"

    # First 4 lines are POST metadata, not needed
    sed -i 1,4d $TMPOUT"1"
    sed -i 1,3d $TMPOUT"2"
    sed -i 1,4d $TMPOUT"3"

    # Keep the name
    NAME=`cat $TMPOUT"2" | tr -d '\r\n'`

    # Files that must be approved first kept in different folder
    if [ -f /etc/approval-needed ];
    then
        mkdir "/mnt/usb/approve/"
        mv $TMPOUT"1" "/mnt/usb/approve/"$NAME
    else 
        mv $TMPOUT"1" "/mnt/usb/"$NAME
    fi

    mkdir "/mnt/usb/thumbnails"

    mv $TMPOUT"3" "/mnt/usb/thumbnails/"$NAME".png"

    # Delete temporary files
    rm $TMPOUT"2"
    rm $TMPOUT
    
    echo 'Status: 204 No Content'
    echo
fi


#!/bin/ash
echo "Content-Type: text/plain"
echo

if [ "$REQUEST_METHOD" = "POST" ]; then
    TMPOUT=/mnt/usb/
    # use a random number generator to allow multiple uploads at the same time
    TMPOUT=$TMPOUT`</dev/urandom tr -dc 0-9 | dd bs=6 count=1 2>/dev/null | sed -e 's/^0\+//'`
    cat >$TMPOUT

    # Split into 4 files:
    # 1.tmp, containing the PDF
    # 2.tmp, containing the PDF name
    # 3.tmp, containing the PDF cover PNG
    csplit --digits=1  --quiet --prefix=$TMPOUT $TMPOUT "/------WebKitFormBoundary/" "{*}"
    
    rm $TMPOUT"0"
    rm $TMPOUT"4"

    # First 4 lines are POST metadata, not needed
    sed -i 1,4d $TMPOUT"1"
    sed -i 1,3d $TMPOUT"2"
    sed -i 1,4d $TMPOUT"3"

    # Keep the name
    NAME=`cat $TMPOUT"2" | tr -d '\r\n'`

    if [ -f /etc/approval-needed ];
    then
        mkdir "/mnt/usb/approval/"
        mv $TMPOUT"1" "/mnt/usb/approval/"$NAME
    else 
        mv $TMPOUT"1" "/mnt/usb/"$NAME
    fi

    mv $TMPOUT"3" "/mnt/usb/thumbnails/"$NAME".png"
    rm $TMPOUT"2"
    rm $TMPOUT
    
        # upload approval needed
        echo "1"
    else
        # aproval not needed
        echo "0"
    fi

    echo 'Status: 204 No Content'
    echo
fi


#!/bin/ash
echo "Content-Type: text/plain"
echo

if [ "$REQUEST_METHOD" = "POST" ]; then
    TMPOUT=/mnt/usb/tmp
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
    mv $TMPOUT"1" "/mnt/usb/"$NAME
    mv $TMPOUT"3" "/mnt/usb/thumbnails/"$NAME".png"

    rm $TMPOUT"2"
    rm $TMPOUT
    
    echo 'Status: 204 No Content'
    echo
fi


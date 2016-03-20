#!/bin/ash
echo "Content-Type: text/plain"
echo

if [ "$REQUEST_METHOD" = "POST" ]; then
    TMPOUT=/mnt/usb/new_book.pdf
    cat >$TMPOUT

    # Get the line count
    LINES=$(wc -l $TMPOUT | cut -d ' ' -f 1)

    # Remove the first four lines
    tail -$((LINES - 4)) $TMPOUT >$TMPOUT.1

    # Remove the last line
    head -$((LINES - 5)) $TMPOUT.1 >$TMPOUT

    # Copy everything but the new last line to a temporary file
    head -$((LINES - 6)) $TMPOUT >$TMPOUT.1

    # Copy the new last line but remove trailing \r\n
    tail -1 $TMPOUT | tr -d '\r\n' >> $TMPOUT.1

    rm $TMPOUT.1

    echo 'Status: 204 No Content'
    echo
fi

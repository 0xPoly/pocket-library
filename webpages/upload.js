"use strict";

PDFJS.workerSrc = "pdf.worker.js";

function generateThumbURI (pdfLocation) {
    // returns base64/URLEncoded thumnail from a PDF file
    PDFJS.getDocument(pdfLocation).then(function(pdf) {
        pdf.getPage(1).then(function(page) {
            var scale = 0.5;
            var viewport = page.getViewport(scale);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            page.render(renderContext).then(function () {
                ctx.globalCompositeOperation = "destination-over";
                //set background color
                ctx.fillStyle = "#fff";
                //draw on entire canvas
                ctx.fillRect( 0, 0, canvas.width, canvas.height );
                var emptyImage = document.getElementById('result');
                var img_src = canvas.toDataURL();
                emptyImage.src = img_src;
                canvas.remove();
            });
        });
    });
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

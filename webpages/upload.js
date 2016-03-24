"use strict";

PDFJS.workerSrc = "books/js/pdf.worker.js";

function generateThumbURI (pdfLocation) {
    return new Promise(function(resolve, reject) {
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
                    var img_src = canvas.toDataURL();
                    canvas.remove();
                    return resolve(img_src);
                });
            });
        }); 
    });
}

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

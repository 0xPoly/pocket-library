"use strict";

PDFJS.workerSrc = "pdf.worker.js";

function PDFtoPNG (pdfLocation) {
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

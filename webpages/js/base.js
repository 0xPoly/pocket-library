"use strict";

var books_list = [];

function getBookList() {
    return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var book_files = xhttp.responseText;
                books_list = book_files.split("\n");
                resolve();
            }
        };
        xhttp.open("GET", "cgi-bin/book-list.sh", true);
        xhttp.send();
    });
} 

function URIexists(URI) {
    return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 404) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }
        };
        xhttp.open("HEAD", URI);
        xhttp.send();
    });
}

function fetchURI(URI) {
    return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                resolve(xhttp.responseText);
            }
        };
        xhttp.open("GET", URI, true);
        xhttp.send();
    });
}

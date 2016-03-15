"use strict";

function setupPage() {
    getBookList();
} 

function getBookList() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var book_files = xhttp.responseText;
            displayBookList(book_files);
        }
    };
    xhttp.open("GET", "cgi-bin/book-list.sh", true);
    xhttp.send();
} 

function displayBookList(book_files) {
    var target = document.getElementById('book-container');
    var bookCovers = formatBookList(book_files)
    target.innerHTML = bookCovers;
}

function formatBookList(book_files) {
    var books_list = book_files.split("\n");
    // remove files that are not PDF, for now
    books_list = books_list.filter(function(element) {return element.indexOf(".pdf") != -1});

    var bookCovers = "";
    for (var x = 0; x < books_list.length; x++) {
        bookCovers += "<div class='book-cover'>"
                      + "<a href='books/" + books_list[x] + "'>"
                      + books_list[x] + "</a>" + "</div>";
    }

    return bookCovers;
}

window.onload = setupPage;

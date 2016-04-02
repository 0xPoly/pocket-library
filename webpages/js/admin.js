"use strict";

function setupPage() {
    getBookList().then(function() {
        fillBookManager();
    });
} 

function fillBookManager() {
    var target = document.getElementById('book-manager-body');
    var bookWidgets = createManagerWidgets();
    if (bookWidgets != "") {
        target.innerHTML = bookWidgets;
    }
}

function createManagerWidgets() {
    // remove files that are not PDF, for now
    books_list = books_list.filter(function(element) {
        return element.indexOf(".pdf") != -1;
    });

    var bookWidgets = "";
    for (var x = 0; x < books_list.length; x++) {
        bookWidgets += generateManagerWidget(books_list[x]);
    }

    return bookWidgets;
}

function generateManagerWidget(bookName) {
        return "<div class='book-widget card'>"
              + "<em>" + bookName + "</em>"
              + "<form class='book-delete' name='upload-form'"
              + "method='post' action='cgi-bin/admin/delete.sh'"
              + "enctype='multipart/form-data'>"
              + "<input type='hidden' name='bookname' value='" + bookName + "'/>"
              + "<input type='submit' value='Delete'/>"
              + "</form>"
              + "</div>";
}

window.onload = setupPage;

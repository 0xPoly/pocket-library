"use strict";

var books_list = [];

function setupPage() {
    funSearchHint();
    getBookList();
    setupUploadButton();
    setupSearchButton();
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
    // keep warning if no books found
    if (bookCovers != "") {
        target.innerHTML = bookCovers;
    }
}

function formatBookList(book_files) {
    books_list = book_files.split("\n");
    // remove files that are not PDF, for now
    var displayed_books_list = books_list.filter(function(element) {
        return element.indexOf(".pdf") != -1;
    });

    var bookCovers = "";
    for (var x = 0; x < displayed_books_list.length; x++) {
        bookCovers += generateBookCard(displayed_books_list[x]);
    }

    return bookCovers;
}

function generateBookCard(bookName) {
        return "<div class='card'>"
              + "<img src='books/thumbnails/" + bookName + ".png'" 
              + "onerror='this.src=\"books/thumbnails/generic.png\"'"
              + "class='card-img'/>"
              + "<a href='books/" + bookName + "'>"
              + bookName + "</a>" + "</div>";
}

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function funSearchHint() {
    var hints = ["Find your favorite book...",
                 "Find that trendy bestseller...",
                 "Find a hidden jem...",
                 "Fiction? Non-fiction?",
                 "What do you want to read?",
                 "Much faster than a librarian!",
                 "Your wish is my command...",
                 "Information wants to be free!",
                 "Read all the things!",
                 "Yours could be here one day...",
                 "Share the love...",
                 "Breaking down barriers...",
                 "Fight the book burners!"];
    var selected = hints.randomElement();
    document.searchbar.searchterm.placeholder = selected; 
}

function setupUploadButton() {
    document.forms["upload-form"]["upload-thing"].onclick = function() {
        prepareAndUpload();
    };
}

function prepareAndUpload() {
    setupBookName();
    setupBookCover();
}

function setupBookName() {
    var filename = document.forms["upload-form"]["file"].files[0].name;
    // bash on OpenWRT doesn't handle spaces in filenames properly
    filename = filename.replace(/ /g,"_");
    document.forms["upload-form"]["filename"].value = filename;
}

function setupBookCover() {
    var bookFile = document.forms["upload-form"]["file"].files[0];
    var bookFileRef = window.URL.createObjectURL(bookFile);
    generateThumbURI(bookFileRef).then(function(base64Thumbnail) {
        var binaryThumbnail = dataURItoBlob(base64Thumbnail);
        var modifiedRequest = new XMLHttpRequest();

        var formData = new FormData(document.forms["upload-form"]);
        formData.append("cover", binaryThumbnail);

        modifiedRequest.open("POST", "cgi-bin/upload.sh");
        modifiedRequest.send(formData);
    });
}

function setupSearchButton() {
    document.forms["searchbar"]["searchbtn"].onclick = function() {
        var searchTerm = document.forms["searchbar"]["searchterm"].value;
        searchBooks(searchTerm);
    };
    document.forms["searchbar"].onsubmit = function() {
        return false;
    }
}

function searchBooks(searchTerm) {
    var searchResults = books_list.filter(function(element) {
        // Regex to be case insensitive
        return element.search(new RegExp(searchTerm, "i")) != -1;
    });

    var bookCovers = "";
    for (var x = 0; x < searchResults.length; x++) {
        bookCovers += generateBookCard(searchResults[x]);
    }

    var target = document.getElementById('book-container');
    if (bookCovers != "") {
        target.innerHTML = bookCovers;
    } else { 
        target.innerHTML = "<div id='searchFail'> No Results Found </div>";
    }

}

window.onload = setupPage;

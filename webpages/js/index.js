"use strict";

var PAGE_NUMBER = 0;
var PAGE_SIZE_BOOKS = 12; // number of books per page
var PAGE_COUNT;

function setupPage() {
    funSearchHint();

    getBookList().then(function() {
        PAGE_COUNT = Math.ceil(books_list.length / PAGE_SIZE_BOOKS);
        displayBookList();
        setupSearchButton();
        setupNavigationButtons();
    });

    setupUploadButton();

    URIexists("cgi-bin/set-password.sh").then(function(exists) {
        if (exists) {
            document.getElementById("no-password-warning").style.display = "block";
        }
    });

    fetchURI("cgi-bin/approval-needed.sh").then(function(response) {
        if (response == 0) {
            document.getElementById("approve-notice").style.display = "none";
        }
    });
} 


function displayBookList(book_files) {
    var target = document.getElementById('book-container');
    var bookCovers = formatBookList(book_files);
    if (bookCovers != "") {
        // show books, navigation menu
        target.innerHTML = bookCovers;
        document.getElementById("navigation").style.display = "block";
    } else {
        // displays no books message, remove loading thing
        document.getElementById("load-message").style.display = "none";
        document.getElementById("nobooks").style.display = "block";
    }
}

function formatBookList(book_files) {
    // remove files that are not PDF, for now
    books_list = books_list.filter(function(element) {
        return element.indexOf(".pdf") != -1;
    });
   
    // update number of pages, to avoid counting non-pdf files
    PAGE_COUNT = Math.ceil(books_list.length / PAGE_SIZE_BOOKS);

    var bookCovers = "";
    for (var x = PAGE_NUMBER * PAGE_SIZE_BOOKS;
            x < books_list.length && x < (PAGE_NUMBER * PAGE_SIZE_BOOKS) + PAGE_SIZE_BOOKS;
            x++) {
        bookCovers += generateBookCard(books_list[x]);
    }

    return bookCovers;
}

function generateBookCard(bookName) {
        return "<div class='card'>"
              + "<img src='books/thumbnails/" + bookName + ".png'" 
              + "onerror='this.src=\"books/thumbnails/generic.png\"'"
              + "class='card-img'/>"
              + "<a href='books/" + bookName + "'>"
              + bookName.replace(/-/g," ") + "</a>" + "</div>";
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

    var messages = ["Still faster than a librarian...",
                    "Books as far as the eye can see...",
                    "CyberLibrary cyberprovides cyberbooks...",
                    "Binding the books as fast as I can!",
                    "Look upon me Library, ye Mighty, and despair!",
                    "Theirs not to reason why, Theirs but to serve eBooks and standby.",
                    "Four score and seven years ago our fathers brought forth this code..."]

    var selected2 = messages.randomElement();
    document.getElementById("witty-loading").innerHTML = selected2; 
}

function setupUploadButton() {
    document.forms["upload-form"]["upload-thing"].onclick = function() {
        prepareAndUpload();
    };
}

function prepareAndUpload() {
    document.forms["upload-form"]["upload-thing"].value = "Uploading...";
    setupBookName();
    setupBookCover();
}

function setupBookName() {
    var filename = document.forms["upload-form"]["file"].files[0].name;
    // bash on OpenWRT doesn't handle spaces in filenames properly
    filename = filename.replace(/ /g,"-");
    document.forms["upload-form"]["filename"].value = filename;
}

function setupBookCover() {
    var bookFile = document.forms["upload-form"]["file"].files[0];
    var bookFileRef = window.URL.createObjectURL(bookFile);
    generateThumbURI(bookFileRef).then(function(base64Thumbnail) {
        var binaryThumbnail = dataURItoBlob(base64Thumbnail);

        // steal data from already-filled form
        var modifiedRequest = new XMLHttpRequest();

        var formData = new FormData(document.forms["upload-form"]);
        formData.append("cover", binaryThumbnail);

        modifiedRequest.open("POST", "cgi-bin/upload.sh");
        modifiedRequest.send(formData);

        modifiedRequest.addEventListener('readystatechange', function(e) {
            // AKA POST request complete and server closed connection
            if (this.readyState == 4) {
                alert("Upload Complete. Thanks!");
                location.reload(true);
            }
        });
    });
}

function setupSearchButton() {
    document.forms["searchbar"]["searchbtn"].onclick = function() {
        var searchTerm = document.forms["searchbar"]["searchterm"].value;
        searchTerm = searchTerm.replace(/ /g,"-");
        searchBooks(searchTerm);
    };
    document.forms["searchbar"].onsubmit = function() {
        var searchTerm = document.forms["searchbar"]["searchterm"].value;
        searchTerm = searchTerm.replace(/ /g,"-");
        searchBooks(searchTerm);
        // disables get request
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

function setupNavigationButtons() {
    var next = document.getElementById("next-btn");
    next.onclick = function() {
        if (PAGE_NUMBER == PAGE_COUNT - 1) {
            // already on last page
            return;
        } else {
            PAGE_NUMBER += 1;
            displayBookList();
        }
        updatePageCounter();
    }

    var previous = document.getElementById("prev-btn");
    previous.onclick = function() {
        if (PAGE_NUMBER == 0) {
            // already on first page
            return;
        } else {
            PAGE_NUMBER -= 1;
            displayBookList();
        }
        updatePageCounter();
    }

    updatePageCounter();
}

function updatePageCounter() {
    var target = document.getElementById("page-counter");
    target.innerHTML = "Page " + (PAGE_NUMBER + 1) + " of " + PAGE_COUNT;
}

window.onload = setupPage;

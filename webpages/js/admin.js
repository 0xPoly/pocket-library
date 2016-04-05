"use strict";

function setupPage() {
    getBookList().then(function() {
        fillBookManager();
    });

    getApprovalList().then(function(approvalBooks) {
        fillApprovalManager(approvalBooks);
    });

    displayApprovalStatus();
    hookUpSwitchButton();
} 

function fillBookManager() {
    var target = document.getElementById('book-manager-body');
    var bookWidgets = createManagerWidgets();
    if (bookWidgets != "") {
        target.innerHTML = bookWidgets;
    }
    document.getElementById("load-message").style.display = "none";
    document.getElementById("everything-else").style.display = "block";
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

function displayApprovalStatus() {
    var target = document.getElementById("approval-status");
    var button = document.getElementById("approval-switch");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            if (xhttp.responseText == 0) {
                target.innerHTML = "Approval currently <em>not</em> needed for uploads.";
                button.innerHTML = "Require Approval";
            }
            else if (xhttp.responseText == 1) {
                target.innerHTML = "Approval is needed before uploads are shown.";
                button.innerHTML = "Disable Approval";
            }
            else { console.error("Invalid approval status"); }
        }
    };

    xhttp.open("GET", "cgi-bin/approval-needed.sh", true);
    xhttp.send();
}

function hookUpSwitchButton() {
    var target = document.getElementById("approval-switch");
    target.onclick = function() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "cgi-bin/admin/approval-switch.sh", true);
        xhttp.send();
        location.reload(true);
    }
}

function getApprovalList() {
    return new Promise(function(resolve, reject) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var book_files = xhttp.responseText;
                resolve(book_files.split("\n"));
            }
        };
        xhttp.open("GET", "cgi-bin/admin/approve-list.sh", true);
        xhttp.send();
    });
}

function fillApprovalManager(books) {
    var target = document.getElementById('approval-list');
    if (books != "") {
        var approveWidgets = createApprovalWidgets(books);
        target.innerHTML = approveWidgets;
        hookupApprovalWidgets();
    }
}

function createApprovalWidgets(books) {
    var result = "";
    for(var i = 0; i < books.length; i++) {
        if (books[i] != "") {
        result += "<div class='approval-widget card book-widget'>"
                + "<a href='/books/approve/" + books[i] + "'>"
                + books[i] + "</a>"
                + "<form class='book-approve'"
                + "method='post' action='cgi-bin/admin/approve.sh'"
                + "enctype='multipart/form-data'>"
                + "<input type='hidden' name='bookname' value='" + books[i] + "'/>"
                + "<input type='submit' value='Approve'/>"
                + "</form>"
                +  "</div>"
        }
    }
    return result;
}

function hookupApprovalWidgets() {
    var approvalWidgets = document.getElementsByClassName("book-approve");
    for (var x = 0; x < approvalWidgets.length; x++) {
        approvalWidgets[x].onsubmit = function () {
            location.reload(true);
            return false;
        }
    }
}

window.onload = setupPage;

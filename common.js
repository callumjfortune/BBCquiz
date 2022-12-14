export function getStorageData(item) {
    return JSON.parse(localStorage.getItem(item)) || {};
}

export function editStorageData(item, callback) {
    var data = JSON.parse(localStorage.getItem(item)) || {};

    callback(data);

    localStorage.setItem(item, JSON.stringify(data));
}

export function generateKey(length = 16, digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_") {
    var key = "";

    for (var i = 0; i < length; i++) {
        key += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return key;
}

export function getUrlParameter(parameter, url = window.location) {
    const value = new URLSearchParams(url.search).get(parameter);

    return value != null ? decodeURIComponent(value) : value;
}

$(function() {
    if (localStorage.getItem("nickname")) {
        $("#signOutButton").removeClass("d-none");
    }
    
    $("#signOutButton").on("click", function() {
        localStorage.removeItem("nickname");
    
        window.location.reload();
    });
});
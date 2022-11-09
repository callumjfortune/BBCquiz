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

export function getUrlParameter(parameter) {
    const value = new URLSearchParams(location.search).get(parameter);

    return value != null ? decodeURIComponent(value) : value;
}

// Difficulty get/set functions moved to `index.js` since they only apply to main page
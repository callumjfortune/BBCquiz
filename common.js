export function editStorageData(callback) {
    var data = JSON.parse(localStorage.getItem("..."));

    callback(data);

    localStorage.setItem("...", JSON.stringify(data));
}

export function getUrlParameter(parameter) {
    const value = new URLSearchParams(location.search).get(parameter);

    return value != null ? decodeURIComponent(value) : value;
}

// Difficulty get/set functions moved to `index.js` since they only apply to main page
export function editStorageData(callback) {
    var data = JSON.parse(localStorage.getItem("..."));

    callback(data);

    localStorage.setItem("...", JSON.stringify(data));
}

export function getUrlParameter(parameter) {
    const value = new URLSearchParams(location.search).get(parameter);

    return value != null ? decodeURIComponent(value) : value;
}

export function getDifficulty() {
    return localStorage.getItem("difficulty") || "beginner";
}

export function setDifficulty(difficulty) {
    localStorage.setItem("difficulty", difficulty);

    document.getElementById("hero-dropdown").innerText = localStorage.getItem("difficulty") == "beginner" ? "beginner" : "expert";
}
export function editStorageData(callback) {
    var data = JSON.parse(localStorage.getItem("..."));

    callback(data);

    localStorage.setItem("...", JSON.stringify(data));
}

export function setDifficulty(difficulty){
    localStorage.setItem("difficulty", difficulty);
    document.getElementById("hero-dropdown").innerText = (localStorage.getItem("difficulty") == "beginner") ? "beginner" : "expert";
}
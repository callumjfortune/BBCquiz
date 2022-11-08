export function editData(callback) {
    var data = JSON.parse(localStorage.getItem("..."));

    callback(data);

    localStorage.setItem("...", JSON.stringify(data));
}
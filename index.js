import * as common from "./common.js";
window.common = common;

import * as api from "./api.js";

window.addEventListener("load", function() {
    api.getQuizQuestions("easy", "history").then(console.log);
});

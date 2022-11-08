import * as common from "./common.js";
<<<<<<< HEAD
window.common = common;

=======
import * as api from "./api.js";

window.addEventListener("load", function() {
    api.getQuizQuestions("easy", "history").then(console.log);
});
>>>>>>> e5bcc8879d00a4de0db8c60f2daf09ae044f474e

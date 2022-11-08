import * as common from "./common.js";

var quizData = null;

export class QuizItem {
    constructor() {}
}

function getQuizData() {
    if (quizData != null) {
        return Promise.resolve(quizData);
    }

    fetch("/quiz_data.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        quizData = data;

        return Promise.resolve(quizData);
    });
}

export function getQuizItems(difficulty, topic) {
    return getQuizData().then(function() {
        var difficultyData = quizData.difficulties[difficulty];

        if (!difficultyData) {
            return Promise.reject("Difficulty does not exist");
        }

        
    });
}
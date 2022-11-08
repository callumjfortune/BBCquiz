import * as common from "./common.js";

var quizData = null;

export class QuizQuestion {
    constructor(question) {
        this.question = question;
    }

    static deserailise(data) {
        switch ("multiple_choice") { // Just hard-coded to multiple choice type for now
            case "multiple_choice":
                return new MultipleChoiceQuizQuestion(data.question, data.options, data.answer);

            default:
                throw new Error("Invalid question type");
        }
    }
}

export class MultipleChoiceQuizQuestion extends QuizQuestion {
    constructor(question, options, answer) {
        super(question);

        this.options = options;
        this.answer = answer;
    }
}

function getQuizData() {
    if (quizData != null) {
        return Promise.resolve(quizData);
    }

    return fetch("/quiz_data.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        quizData = data;

        return Promise.resolve(quizData);
    });
}

export function getQuizQuestions(difficulty, topic) {
    return getQuizData().then(function() {
        var difficultyData = quizData.difficulties[difficulty];

        if (!difficultyData) {
            return Promise.reject(`Difficulty "${difficulty}" does not exist`);
        }

        var topicData = difficultyData.topics[topic];

        if (!topicData) {
            return Promise.reject(`Topic "${topic}" for given difficulty "${difficulty}" does not exist`);
        }

        return Promise.resolve(topicData.questions.map(function(questionData) {
            return QuizQuestion.deserailise(questionData);
        }));
    });
}
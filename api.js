import * as common from "./common.js";

var quizData = null;

export const SIGNED_IN_USER = undefined;

export class Topic {
    constructor(id, data, info) {
        this.id = id;
        this.data = data;
        this.info = info;
    }

    get questionsCount() {
        return Object.keys(this.data.questions).length;
    }
}

export class QuizQuestion {
    constructor(question) {
        this.question = question;
    }

    static deserailise(data) {
        switch (data.type || "multiple_choice") { // Fallback to multiple choice if no type is specified
            case "multiple_choice":
                return new MultipleChoiceQuizQuestion(data.question, data.options, data.answer);

            case "video":
                return new VideoQuizQuestion(data.question, data.videoUrl, data.options, data.answer);

            case "true_or_false":
                return new TrueOrFalseQuizQuestion(data.question, data.answer);

            case "image":
                return new ImageQuizQuestion(data.question, data.imageurl, data.options, data.answer);

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

export class VideoQuizQuestion extends MultipleChoiceQuizQuestion {
    constructor(question, videoUrl, options, answer) {
        super(question, options, answer);

        this.videoUrl = videoUrl;
    }
}

export class ImageQuizQuestion extends MultipleChoiceQuizQuestion {
    constructor(question, imageurl, options, answer) {
        super(question, options, answer);

        this.imageUrl = imageurl;
    }
}

export class TrueOrFalseQuizQuestion extends MultipleChoiceQuizQuestion {
    constructor(question, answer) {
        super(question, {
            "true": "True",
            "false": "False"
        }, answer);
    }
}

export function getQuizData() {
    if (quizData != null) {
        return Promise.resolve(quizData);
    }

    return fetch("quiz_data.json").then(function(response) {
        return response.json();
    }).then(function(data) {
        quizData = data;

        return Promise.resolve(quizData);
    });
}

export function getTopics(difficulty) {
    return getQuizData().then(function() {
        var difficultyData = quizData.difficulties[difficulty];

        if (!difficultyData) {
            return Promise.reject(`Difficulty "${difficulty}" does not exist`);
        }

        return Promise.resolve(Object.keys(difficultyData.topics).map(function(topicId) {
            var topicData = difficultyData.topics[topicId];
            return new Topic(topicId, topicData, quizData.topic_info[topicId]);
        }));
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

export function sendAnalyticsEvent(eventType, eventData) {
    common.editStorageData("analytics", function(data) {
        data[eventType] ||= [];

        data[eventType].push({
            ...eventData,
            id: common.generateKey(),
            timestamp: Date.now()
        });

        return data;
    });
}



export function registerUser(nickname) {
    var users = common.getStorageData("users").users || {};

    if (users[nickname]) {
        return Promise.reject("User already exists");
    }

    common.editStorageData("users", function(data) {
        data.users ||= {};
        data.users[nickname] = {score: 0, attempts: 0};
    });

    localStorage.setItem("nickname", nickname);

    return Promise.resolve();
}

export function isSignedIn() {
    return localStorage.getItem("nickname") != null;
}

export function getUserData(nickname = localStorage.getItem("nickname")) {
    var users = common.getStorageData("users").users || {};

    if (!users[nickname]) {
        return Promise.reject("User does not exist");
    }

    return Promise.resolve(users[nickname]);
}

export function setUserData(nickname = localStorage.getItem("nickname"), data) {
    var users = common.getStorageData("users").users || {};

    if (!users[nickname]) {
        return Promise.reject("User does not exist");
    }

    if (typeof(data) != "object") {
        return Promise.reject("Data must be an object to merge into existing user data");
    }

    common.editStorageData("users", function(userData) {
        userData.users[nickname] = {...userData.users[nickname], ...data};
    });

    return Promise.resolve();
}

export function getLeagueTable() {
    var users = common.getStorageData("users").users || {};

    return Promise.resolve(Object.keys(users).map(function(nickname) {
        return {nickname, ...users[nickname]};
    }).sort((a, b) => b.score - a.score)); // Sort descending
}
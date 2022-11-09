import * as common from "./common.js";

var quizData = null;

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

export function getAnalyticsProfileId() {
    var id = localStorage.getItem("analyticsProfileId");

    if (!id) {
        id = common.generateKey();

        localStorage.setItem("analyticsProfileId", id);
    }

    return id;
}

export function sendAnalyticsEvent(eventType, eventData) {
    common.editStorageData("analytics", function(data) {
        data[eventType] ||= [];

        data[eventType].push({
            ...eventData,
            id: common.generateKey(),
            profileId: getAnalyticsProfileId(),
            timestamp: Date.now()
        });

        return data;
    });
}
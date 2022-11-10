import * as api from "../api.js";

QUnit.module("Api Tests", hooks => {
    hooks.beforeEach(function() {
        this.questionsStub = {questions:[
            {question: "Test1"},
            {question: "Test2"}
        ]};

        this.topicInfoStub = {
            title:"TestTopic",
            description: "None",
            image_url: "/media/topics/celebrities.jpeg"
        };
    });


QUnit.test("Tests Recognised", function(assert) 
{
    assert.equal(true, true);
});

QUnit.test("TopicCountQuestions_ReturnsNumberOfQuestions", function(assert)
{
    var testTopic = new api.Topic("Test", this.questionsStub, this.topicInfoStub);
    assert.equal(testTopic.questionsCount, 2)
});

QUnit.test("GetTopics_GivenInvalidTopic_ReturnsRejectedPromise", function(assert)
{
    assert.rejects(api.getTopics('medium'));
});

QUnit.test("GetTopics_GievnValidTopic_ReturnsTruthy", function(assert)
{
    const done = assert.async();

    api.getTopics('expert').then((data) => {
        assert.ok(data);
        done();
    })
});

QUnit.test("GetQuizQuestions_GivenValidInput_ReturnsTruthy", function(assert)
{
    const done = assert.async();

    api.getQuizQuestions('expert', 'history').then((questions) => {
        assert.ok(questions);
        done();
    })
});

QUnit.test("GetQuizQuestions_GivenInvalidInput_ReturnsRejectedPromise", function(assert)
{
    assert.rejects(api.getQuizQuestions('medium', 'keyboard_science'));
});

});
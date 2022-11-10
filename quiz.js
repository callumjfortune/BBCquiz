import * as common from "./common.js";
import * as api from "./api.js";

var difficulty = common.getUrlParameter("difficulty");
var topic = common.getUrlParameter("topic");
var quizQuestions = null;
var quizCorrelationId = common.generateKey();

$(".quizQuestions").submit(function( event )
{
    event.preventDefault();
    var data = new FormData(event.target);

    var correctAnswers = 0;
    var attemptedAnswers = 0;

    for (const value of data.entries())
    {   
        var questionIndex = value[0].split('_')[1];

        attemptedAnswers++;

        if (quizQuestions[questionIndex].answer === value[1])
        {
            correctAnswers ++;
            $(`#quizQuestionCard_${questionIndex} .questionResult`).removeClass("d-none");
            $(`#quizQuestionCard_${questionIndex} .questionResult`).addClass("alert-success");
            $(`#quizQuestionCard_${questionIndex} .questionResult`).text("Answer Correct!");
            
        }else
        {
            $(`#quizQuestionCard_${questionIndex} .questionResult`).removeClass("d-none");
            $(`#quizQuestionCard_${questionIndex} .questionResult`).addClass("alert-danger");
            $(`#quizQuestionCard_${questionIndex} .questionResult`).text("Answer Incorrect!");
        }

        
    }

    $("#quizResults").removeClass("d-none");
    $("#quizResults").text(`You answered ${correctAnswers} out of ${quizQuestions.length} questions correctly!`);

    $(".btn-success").text("Return to home");
    $(".btn-success").attr("onclick", "window.location.href = '/'");

    api.sendAnalyticsEvent("completeQuiz", {
        topic,
        difficulty,
        quizCorrelationId,
        correctAnswers,
        attemptedAnswers,
        questionCount: quizQuestions.length,
        multipleChoiceQuestionsPresent: quizQuestions.filter((question) => question instanceof api.MultipleChoiceQuizQuestion).length,
        videoQuestionsPresent: quizQuestions.filter((question) => question instanceof api.VideoQuizQuestion).length,
        trueOrFalseQuestionsPresent: quizQuestions.filter((question) => question instanceof api.TrueOrFalseQuizQuestion).length
    });

    if (api.isSignedIn()) {
        api.getUserData().then(function(data) {
            api.setUserData(api.SIGNED_IN_USER, {score: data.score + correctAnswers, attempts: data.attempts + 1});
        });
    }
    
});


$(function() {
    api.getQuizQuestions(difficulty, topic).then(function(questions) {
        quizQuestions = questions;
        $(".quizQuestions").empty();

        $(".quizQuestions").append(
            questions.map((question, questionIndex) => $("<div class='card mb-2'>").append([
                $("<div class='card-body'>").append([
                    $("<h2 class='card-title h5'>").text(question.question),
                    question instanceof api.VideoQuizQuestion ? (
                        $("<iframe class='video'>")
                            .attr("src", question.videoUrl)
                            .attr("allowfullscreen", "true")
                            .attr("frameborder", "0")
                    ) : null,
                    question instanceof api.ImageQuizQuestion ? (
                        $("<img width=100% class=mb-4>")
                            .attr("src", question.imageUrl)
                    ) : null,
                    $("<div class='form-check'>").append(
                        Object.keys(question.options).map((optionId) => $("<div class='mb-2'>").append([
                            $("<input type='radio' class='form-check-input'>")
                                .attr("name", `quizQuestionOptions_${questionIndex}`)
                                .attr("id", `quizQuestionOption_${questionIndex}_${optionId}`)
                                .attr("value", optionId)
                            ,
                            $("<label class='form-check-label'>")
                                .attr("for", `quizQuestionOption_${questionIndex}_${optionId}`)
                                .text(question.options[optionId])
                        ]))
                    )
                ]).attr("id", `quizQuestionCard_${questionIndex}`).append(
                    $("<div class='questionResult alert alert-success d-none m-0' ></div>")
                )
            ]))
        ).append(
            $("<div id='quizResults' class='alert alert-success d-none' ></div>")
        ).append(
            $("<button class='btn btn-success' type='submit' >Submit Answers</button>")
        );

        api.sendAnalyticsEvent("loadQuiz", {
            topic,
            difficulty,
            quizCorrelationId,
            questionCount: quizQuestions.length,
            multipleChoiceQuestionsPresent: quizQuestions.filter((question) => question instanceof api.MultipleChoiceQuizQuestion).length,
            videoQuestionsPresent: quizQuestions.filter((question) => question instanceof api.VideoQuizQuestion).length,
            trueOrFalseQuestionsPresent: quizQuestions.filter((question) => question instanceof api.TrueOrFalseQuizQuestion).length
        });
    }).catch(function(error) {
        console.error(error);

        $(".quizQuestions").empty();

        $(".quizQuestions").append([
            $("<div class='alert alert-danger'>").append([
                $("<h1>").text("Oops, we can't get that quiz"),
                $("<p>").text("It looks like we couldn't find the quiz you wanted to play. Try going back to the topics list and selecting another quiz."),
                $("<a class='btn btn-danger'>")
                    .attr("href", "/")
                    .text("Back to topics")
            ])
        ]);
    });
});

import * as common from "./common.js";
import * as api from "./api.js";

var difficulty = common.getUrlParameter("difficulty");
var topic = common.getUrlParameter("topic");
var quizQuestions = null;

$(".quizQuestions").submit(function( event )
{
    event.preventDefault();
    var data = new FormData(event.target);

    var correctAnswers = 0;

    for (const value of data.entries())
    {   
        var questionIndex = value[0].split('_')[1];
        if (quizQuestions[questionIndex].answer === value[1]){correctAnswers ++;}

    }

    $("#quizResults").removeClass("d-none");
    $("#quizResults").text(`You answered ${correctAnswers} out of ${quizQuestions.length} questions correctly!`);
});


$(function() {
    api.getQuizQuestions(difficulty, topic).then(function(questions) {
        quizQuestions = questions;
        $(".quizQuestions").empty();

        $(".quizQuestions").append(
            questions.map((question, questionIndex) => $("<div class='card mb-2'>").append([
                $("<div class='card-body'>").append([
                    $("<h5 class='card-title'>").text(question.question),
                    question instanceof api.VideoQuizQuestion ? (
                        $("<iframe class='video'>")
                            .attr("src", question.videoUrl)
                            .attr("allowfullscreen", "true")
                            .attr("frameborder", "0")
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
                ])
            ]))
        ).append(
            $("<div id='quizResults' class='alert alert-success d-none' ></div>")
        ).append(
            $("<button class='btn btn-success' type='submit'>Submit Answers</button>")
        );

        api.sendAnalyticsEvent("loadQuiz", {topic, difficulty});
    }).catch(function(error) {
        console.log(error);

        $(".quizForm").empty();

        $(".quizForm").append([
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

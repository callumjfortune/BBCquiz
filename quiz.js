import * as common from "./common.js";
import * as api from "./api.js";

var difficulty = common.getUrlParameter("difficulty");
var topic = common.getUrlParameter("topic");

$(function() {
    api.getQuizQuestions(difficulty, topic).then(function(questions) {
        $(".quizQuestions").empty();

        $(".quizQuestions").append(
            questions.map((question, questionIndex) => $("<div class='card mb-2'>").append([
                $("<div class='card-body'>").append([
                    $("<h5 class='card-title'>").text(question.question),
                    $("<div class='form-check'>").append(
                        Object.keys(question.options).map((optionId) => $("<div class='mb-2'>").append([
                            $("<input type='radio' class='form-check-input'>")
                                .attr("name", `quizQuestionOptions_${questionIndex}`)
                                .attr("id", `quizQuestionOption_${questionIndex}_${optionId}`)
                            ,
                            $("<label class='form-check-label'>")
                                .attr("for", `quizQuestionOption_${questionIndex}_${optionId}`)
                                .text(question.options[optionId])
                        ]))
                    )
                ])
            ]))
        );
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
import * as common from "./common.js";
window.common = common;

import * as api from "./api.js";

function loadTopicsList() {
    return api.getTopics(common.getDifficulty()).then(function(topics) {
        $(".topicsList").empty();

        $(".topicsList").append(topics.map((topic) => $("<div class='col'>").append([
            $("<div class='card rounded-0'>").append([
                $("<img>")
                    .attr("src", topic.info?.image_url)
                    .attr("height", "250")
                    .addClass("card-img-top img-cover image-cover-n rounded-0")
                ,
                $("<div class='card-body'>").append([
                    $("<h2 class='card-text'>").append([
                        $("<a class='text-reset text-decoration-none stretched-link'>")
                            .attr("href", `quiz.html?difficulty=${encodeURIComponent(common.getDifficulty())}&topic=${encodeURIComponent(topic.id)}`)
                            .text(topic.info?.title)
                    ]),
                    $("<p class='card-text'>").text(topic.info?.description)
                ])
            ])
        ])));
    }).catch(function(error) {
        console.error(error);

        localStorage.setItem("difficulty", "beginner"); // Just in case invalid difficulty is source of error

        $(".topicsList").empty();
        $(".topicsList").attr("class", "topicsList");

        $(".topicsList").append([
            $("<div class='alert alert-danger'>").append([
                $("<h1>").text("Oops, we can't load the quiz topics"),
                $("<p>").text("It looks like we couldn't find the available topics for the selected difficulty. Check your connection to the internet and try again."),
                $("<a class='btn btn-danger'>")
                    .attr("href", "/")
                    .text("Try again")
            ])
        ]);
    });
}

$(function() {
    api.getQuizQuestions("easy", "history").then(console.log);

    loadTopicsList();
});
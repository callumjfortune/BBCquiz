import * as common from "./common.js";
window.common = common;

import * as api from "./api.js";

function loadTopicsList() {
    return api.getTopics("easy").then(function(topics) {
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
                            .attr("href", "quiz-geography.html")
                            .text(topic.info?.title)
                    ]),
                    $("<p class='card-text'>").text(topic.info?.description)
                ])
            ])
        ])));
    });
}

$(function() {
    api.getQuizQuestions("easy", "history").then(console.log);

    loadTopicsList();
});
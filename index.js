import * as common from "./common.js";
window.common = common;

import * as api from "./api.js";

window.getDifficulty = function() {
    return localStorage.getItem("difficulty") || "beginner";
};

window.setDifficulty = function(difficulty) {
    localStorage.setItem("difficulty", difficulty);

    updateDifficultyDropdown();
    loadTopicsList(); // We have to re-call this function so that the URL queries in the links for each topic are updated to reflect the chosen difficulty
    loadTopicType();
};

function showAnalyticsToast() {
    var new_visitor = localStorage.getItem("first_visit") || true;
    if (new_visitor != "true") 
    { 
        $("#analyticsToast").toast("show");
        localStorage.setItem("first_visit", true);
    }
};


function updateDifficultyDropdown() {
    $("#hero-dropdown").text(getDifficulty() == "beginner" ? "Difficulty: Beginner" : "Difficulty: Expert");
}

function loadTopicsList() {
    return api.getTopics(getDifficulty()).then(function(topics) {
        $(".topicsList").empty();

        $(".topicsList").append(topics.map((topic) => $("<div class='col'>").append([
            $("<div class='card rounded-0'>").append([
                    $("<div class='quiz-type-tag' id='"+topic.id+"-card' >")
                        .text(api.getQuizData().then(function (data) {
                            var responseData = data["difficulties"][getDifficulty()]["topics"][topic.id]["type"];
                            $("#"+topic.id+"-card").text(responseData);
                        })),
                $("<img alt=''>")
                    .attr("src", topic.info?.image_url)
                    .attr("height", "250")
                    .addClass("card-img-top img-cover image-cover-n rounded-0")
                ,
                $("<div class='card-body'>").append([
                    $("<h2 class='card-text'>").append([
                        $("<a class='text-reset text-decoration-none stretched-link'>")
                            .attr("href", `quiz.html?difficulty=${encodeURIComponent(getDifficulty())}&topic=${encodeURIComponent(topic.id)}`)
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
                    .attr("href", "index.html")
                    .text("Try again")
            ])
        ]);
    });
}

$(function() {
    updateDifficultyDropdown();
    loadTopicsList();
    showAnalyticsToast();
});
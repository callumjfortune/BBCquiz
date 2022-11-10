import * as api from "./api.js";

window.api = api;

function loadLeagueTable() {
    api.getLeagueTable().then(function(results) {
        $(".leagueTable").empty();
        if(results.length == 0) {
            $(".leagueTable").append($("<div class='alert alert-danger'>").append([
                $("<h1>").text("Oops, nobody is on the leaderboard!"),
                $("<p>").text("Fetch your friends over and get quizzing!"),
                $("<a class='btn btn-danger'>")
                    .attr("href", "index.html")
                    .text("Back to topics")
            ]));

        }
        $(".leagueTable").append(
            results.map((result, i) => $("<li class='card d-flex align-items-stretch flex-row align-items-start my-1'>").append([
                $("<div class='p-2 h4 my-0 index' aria-hidden='true'>").text(i + 1),
                $("<div class='p-2 flex-fill'>").append([
                    $("<p class='h4 mb-0 text-truncate'>").text(result.nickname + (localStorage.getItem("nickname") == result.nickname ? " (you)" : "")),
                    $("<p class='mb-0'>").text(`Score of ${result.score} with ${result.attempts == 1 ? "1 attempt" : `${result.attempts} attempts`}`)
                ])
            ]))
        );
    });
}

$(function() {
    loadLeagueTable();
});
import * as common from "./common.js";

var analyticsData = {};
var analyticsEvent = "loadQuiz";

$(function() {
    analyticsData = common.getStorageData("analytics");

    $("#analyticsEvent").on("change", function() {
        analyticsEvent = $("#analyticsEvent").val();
    });

    $("#exportCsv").on("click", function() {
        var csv = [];
        var eventData = analyticsData[analyticsEvent];

        csv[0] = Object.keys(eventData[eventData.length - 1]).join(",");

        eventData.forEach(function(datum) {
            csv.push(Object.values(datum).map((datum) => `"${datum}"`).join(","));
        });

        csv = csv.join("\n");

        var downloader = $("<a>")
            .attr("href", URL.createObjectURL(new Blob([csv], {type: "text/csv"})))
            .attr("download", analyticsEvent)
            .css("display", "none")
        ;

        $("body").append(downloader);

        downloader[0].click();
    });
});
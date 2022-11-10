import * as common from "./common.js";

var analyticsData = {};
var analyticsEvent = "loadQuiz";

function renderAnalyticsViewer() {
    var eventData = analyticsData[analyticsEvent];

    $("#analyticsViewer").empty();

    $("#analyticsViewer").append([
        $("<thead>").append(
            $("<tr>").append(
                ...Object.keys(eventData[eventData.length - 1]).map((field) => $("<th>").text(field))
            )
        ),
        $("<tbody>").append(
            eventData.map((datum) => $("<tr>").append(
                Object.values(datum).map((value) => $("<td>").text(value))
            ))
        )
    ]);
}

$(function() {
    analyticsData = common.getStorageData("analytics");

    renderAnalyticsViewer();

    $("#analyticsEvent").on("change", function() {
        analyticsEvent = $("#analyticsEvent").val();

        renderAnalyticsViewer();
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
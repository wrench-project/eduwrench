// Disable "Run Simulation" button for 5 seconds after submit
function disableRunSimulationButton() {
    let run_simulation_button = $("#run-button");

    run_simulation_button.attr("disabled", "disabled");
    setTimeout(function () {
        run_simulation_button.removeAttr("disabled");
    }, 3000);
}

function prepareResponseData(responseData) {
    return {
        tasks: responseData.workflow_execution.tasks,
        disk: responseData.disk_operations,
        contents: responseData.workflow_execution.tasks // TODO: remove
    };
}

function updateFigureLabel(divId, spanLabel, minRange, maxRange, labelText, labelUnit) {
    $("#" + divId).on("keyup", function () {
        let input_el = $(this);
        let input_value = parseInt(input_el.val());
        let label_el = $("." + spanLabel);

        if (input_value >= minRange && input_value <= maxRange) {
            if (labelText === "") {
                label_el.text(input_value + " " + labelUnit).css("background-color", "#d3ffe9");
            } else {
                label_el.text(labelText + ": " + input_value + " " + labelUnit).css("background-color", "#d3ffe9");
            }
            input_el.removeClass("is-invalid").addClass("is-valid");

            setTimeout(function () {
                if (label_el.css("background-color") === "rgb(211, 255, 233)") {
                    label_el.css("background-color", "");
                }
            }, 500);
        } else {
            label_el.css("background-color", "#ffb7b5");
            input_el.removeClass("is-valid").addClass("is-invalid");
        }
    });
}

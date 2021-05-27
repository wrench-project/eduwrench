/**
 * Disable "Run Simulation" button for 5 seconds after submit
 */
function disableRunSimulationButton() {
    let run_simulation_button = $("#run-button");

    run_simulation_button.attr("disabled", "disabled");
    setTimeout(function () {
        run_simulation_button.removeAttr("disabled");
    }, 3000);
}

/**
 *
 * @param responseData
 * @returns {{disk: *, contents: {}, tasks: {}, network: (*|*[])}}
 */
function prepareResponseData(responseData) {
    let links = responseData.link_usage ? responseData.link_usage.links : [];
    return {
        tasks: responseData.workflow_execution.tasks,
        disk: responseData.disk_operations,
        contents: responseData.workflow_execution.tasks, // TODO: remove
        network: links
    };
}

/**
 *
 * @param input_el
 * @param minRange
 * @param maxRange
 * @param label
 */
function validateFieldInRange(input_el, minRange, maxRange, label = null, valueLambdaFunction) {
    let input_value = input_el.val();
    let run_simulation_button = $("#run-button");

    if (input_value >= minRange && input_value <= maxRange) {
        input_el.removeClass("is-invalid").addClass("is-valid");
        run_simulation_button.attr("disabled", "enabled");
        run_simulation_button.removeAttr("disabled");
        if (label) {
            for (let idx in label) {
                let label_el = $(label[idx].className);
                let textLabel = input_value;
                if (valueLambdaFunction) {
                    textLabel = valueLambdaFunction(input_value);
                }
                if (label[idx].pretext) {
                    textLabel = label[idx].pretext + " " + textLabel;
                }
                if (label[idx].text) {
                    textLabel += " " + label[idx].text;
                }
                label_el.text(textLabel).css("background-color", "#d3ffe9");
                setTimeout(function () {
                    if (label_el.css("background-color") === "rgb(211, 255, 233)") {
                        label_el.css("background-color", "");
                    }
                }, 500);
            }
        }

    } else {
        if (label) {
            for (let idx in label) {
                let label_el = $(label[idx].className);
                label_el.css("background-color", "#ffb7b5");
            }
        }
        input_el.removeClass("is-valid").addClass("is-invalid");
        run_simulation_button.attr("disabled", "disabled");
    }
}

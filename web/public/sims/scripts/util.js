// Disable "Run Simulation" button for 5 seconds after submit
function disableRunSimulationButton() {
    let run_simulation_button = $("#run-button");

    run_simulation_button.attr("disabled", "disabled");
    setTimeout(function () {
        run_simulation_button.removeAttr("disabled");
    }, 3000);
}

function prepareResponseData(responseData) {
    let links = responseData.link_usage ? responseData.link_usage.links : [];
    return {
        tasks: responseData.workflow_execution.tasks,
        disk: responseData.disk_operations,
        contents: responseData.workflow_execution.tasks, // TODO: remove
        network: links
    };
}

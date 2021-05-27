$(function () {

    // Update the label that states task #1's input size
    $("#mcit-io-task1-input-size").on("keyup", function () {
        validateFieldInRange($(this), 1, 1000, [{className: ".mcit-io-task1-input-size-label", text: "MB"}]);
    });

    // Update the label that states task #1's output size
    $("#mcit-io-task1-output-size").on("keyup", function () {
        validateFieldInRange($(this), 1, 1000, [{className: ".mcit-io-task1-output-size-label", text: "MB"}]);
    });

    // Update the label that says how much GFlop each task is. Converts to TFlop to save space if it gets too large.
    $("#mcit-io-task1-work").on("keyup", function () {
        validateFieldInRange($(this), 100, 1000, [{className: ".mcit-io-task1-work-label", text: "GFlop"}]);
    });

    $('#simulator-form-mcit-io').on('submit', function (event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        $('.chart').css('display', 'block');

        // remove the graphs, since we will append a new ones to the chart
        $('.chart > svg').remove();

        // get google user information
        let userName = localStorage.getItem("userName");
        let email = localStorage.getItem("email");

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen. 
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/multi_core_independent_tasks_io',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    task1_input_size: $("#mcit-io-task1-input-size").val(),
                    task1_output_size: $("#mcit-io-task1-output-size").val(),
                    task1_work: $("#mcit-io-task1-work").val(),
                    task2_input_size: 100,
                    task2_output_size: 100,
                    task2_work: 500,
                    first_task: $('input[name=mcit-io-task-select]:checked').val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#mcit-io-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                generateGanttChart(executionData, 'mcit-io-graph-container', zoom = false);
                generateHostUtilizationChart(executionData, 'mcit-io-host-utilization-chart',
                    hostsList = [], diskHostsList = [], zoom = false);
                hostUtilizationData = {
                    data: executionData,
                    containedId: 'mcit-io-host-utilization-chart',
                    hostsList: [],
                    diskHostsList: []
                }

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

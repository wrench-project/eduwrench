$(function () {

    // Update the label that says how many tasks will be run
    $("#num-tasks").on("keyup", function () {
        validateFieldInRange($(this), 1, 100, [{className: ".num-tasks-label", text: "Task(s)"}]);
    });

    // Update the label that says how much GFlop each task is. Converts to TFlop to save space if it gets too large.
    $("#task-gflop").on("keyup", function () {
        let task_gflop_input_el = $(this);
        let task_gflop_input_value = parseInt(task_gflop_input_el.val());
        let task_gflop_label_el = $(".task-gflop-label");

        if (task_gflop_input_value >= 1 && task_gflop_input_value < 1000) {

            task_gflop_label_el.text(task_gflop_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_gflop_label_el.css("background-color") === "rgb(211, 255, 233)") {
                    task_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else if (task_gflop_input_value >= 1000 && task_gflop_input_value < 1000000) {
            task_gflop_label_el.text(task_gflop_input_value / 1000 + " TFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_gflop_label_el.css("background-color") === "rgb(211, 255, 233)") {
                    task_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task_gflop_label_el.css("background-color", "#ffb7b5");
            task_gflop_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    // Update the label that says how much input data must be read from disk for each task.
    $("#task-input").on("keyup", function () {
        validateFieldInRange($(this), 1, 999, [{className: ".task-input-label", pretext: "In:", text: "MB"}]);
    });

    // Update the label that says how much output data must be written to disk for each task.
    $("#task-output").on("keyup", function () {
        validateFieldInRange($(this), 1, 999, [{className: ".task-output-label", pretext: "Out:", text: "MB"}]);
    });

    $('#simulator-form-io-operations').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/io_operations',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    task_input: $("#task-input").val(),
                    task_output: $("#task-output").val(),
                    num_tasks: $("#num-tasks").val(),
                    task_gflop: $("#task-gflop").val(),
                    io_overlap: !!$('#io-overlap').is(':checked'),
                    userName: userName,
                    email: email
                }),

            success: function (response) {
                // Add the new simulation output into the "Simulation Output" section
                $("#io-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                generateGanttChart(executionData, 'io-graph-container');
                generateHostUtilizationChart(executionData, 'io-host-utilization-chart', [], [], false);
                hostUtilizationData = {
                    data: executionData,
                    containedId: 'io-host-utilization-chart',
                    hostsList: [],
                    diskHostsList: []
                }

                let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                populateWorkflowTaskDataTable(prepared_data, 'io-task-details-table');
            }
        });
    });
});

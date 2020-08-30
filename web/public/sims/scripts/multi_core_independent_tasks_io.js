$(function () {

    // Update the label that says how many cores each compute node has
    $("#mcit-io-task1-input-size").on("keyup", function () {
        let task1_input_size_el = $(this);
        let task1_input_size_value = parseInt(task1_input_size_el.val());
        let task1_input_size_label_el = $(".mcit-io-task1-input-size-label");

        if (task1_input_size_value >= 1 && task1_input_size_value <= 1000) {

            task1_input_size_label_el.text(task1_input_size_value + " MB")
                .css("background-color", "#d3ffe9");

            task1_input_size_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task1_input_size_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task1_input_size_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task1_input_size_label_el.css("background-color", "#ffb7b5");
            task1_input_size_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    // Update the label that says how many cores each compute node has
    $("#mcit-io-task1-output-size").on("keyup", function () {
        let task1_output_size_el = $(this);
        let task1_output_size_value = parseInt(task1_output_size_el.val());
        let task1_output_size_label_el = $(".mcit-io-task1-output-size-label");

        if (task1_output_size_value >= 1 && task1_output_size_value <= 1000) {

            task1_output_size_label_el.text(task1_output_size_value + " MB")
                .css("background-color", "#d3ffe9");

            task1_output_size_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task1_output_size_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task1_output_size_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task1_output_size_label_el.css("background-color", "#ffb7b5");
            task1_output_size_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });


    // Update the label that says how much GFlop each task is. Converts to TFlop to save space if it gets too large.
    $("#mcit-io-task1-work").on("keyup", function () {
        let task1_work_input_el = $(this);
        let task1_work_input_value = parseInt(task1_work_input_el.val());
        let task1_work_label_el = $(".mcit-io-task1-work-label");

        console.log(task1_work_label_el);
        console.log(task1_work_input_el);

        if (task1_work_input_value >= 1 && task1_work_input_value < 1000) {

            task1_work_label_el.text(task1_work_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            task1_work_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task1_work_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task1_work_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task1_work_label_el.css("background-color", "#ffb7b5");
            task1_work_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
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

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

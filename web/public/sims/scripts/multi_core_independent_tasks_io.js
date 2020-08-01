$(function () {

    // Update the label that says how many cores each compute node has
    $("#task1-input-size").on("keyup", function () {
        let task1_input_size_el = $(this);
        let task1_input_size_value = parseInt(task1_input_size_el.val());
        let task1_input_size_label_el = $(".task1-input-size");

        if (task1_input_size_value >= 100 && task1_input_size_value <= 1000) {

            task1_input_size_label_el.text("Input size: " + task1_input_size_value)
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
    $("#task1-output-size").on("keyup", function () {
        let task1_output_size_el = $(this);
        let task1_output_size_value = parseInt(task1_output_size_el.val());
        let task1_output_size_label_el = $(".task1-output-size");

        if (task1_output_size_value >= 100 && task1_output_size_value <= 1000) {

            task1_output_size_label_el.text("Output size: " + task1_output_size_value)
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
    $("#task1-gflop").on("keyup", function () {
        let task1_gflop_input_el = $(this);
        let task1_gflop_input_value = parseInt(task1_gflop_input_el.val());
        let task1_gflop_label_el = $(".task-gflop-label");

        if (task1_gflop_input_value >= 100 && task1_gflop_input_value < 1000) {

            task1_gflop_label_el.text(task1_gflop_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            task1_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task1_gflop_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task1_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else if (task1_gflop_input_value >= 1000 && task1_gflop_input_value < 1000000) {
            task1_gflop_label_el.text(task1_gflop_input_value / 1000 + " TFlop")
                .css("background-color", "#d3ffe9");

            task1_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task1_gflop_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task1_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task1_gflop_label_el.css("background-color", "#ffb7b5");
            task1_gflop_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });


    $('#simulator-form').on('submit', function (event) {
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
                    task1_input_size: $("#task1-input-size").val(),
                    task1_output_size: $("#task1-output-size").val(),
                    task1_work: $("#task1-work").val(),
                    task2_input_size: 500,
                    task2_output_size: 500,
                    task2_work: 500,
                    first_task: $('input[name=task-select]:checked').val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                generateGanttChart(executionData);
                generateHostUtilizationChart(executionData);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

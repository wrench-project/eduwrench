$(function () {

    // Update the label that says how many cores each compute node has
    $("#mcit-num-cores").on("keyup", function () {
        let num_cores_input_el = $(this);
        let num_cores_input_value = parseInt(num_cores_input_el.val());
        let num_cores_label_el = $(".mcit-num-cores-label");

        if (num_cores_input_value >= 1 && num_cores_input_value <= 32) {

            num_cores_label_el.text("Cores: " + num_cores_input_value)
                .css("background-color", "#d3ffe9");

            num_cores_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_label_el.css("background-color", "#ffb7b5");
            num_cores_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    // Update the label that says how many tasks will be run
    $("#mcit-num-tasks").on("keyup", function () {
        let num_tasks_input_el = $(this);
        let num_tasks_input_value = parseInt(num_tasks_input_el.val());
        let num_tasks_label_el = $(".mcit-num-tasks-label");

        if (num_tasks_input_value >= 1 && num_tasks_input_value < 1000) {

            num_tasks_label_el.text(num_tasks_input_value + " Task(s)")
                .css("background-color", "#d3ffe9");

            num_tasks_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_tasks_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_tasks_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_tasks_label_el.css("background-color", "#ffb7b5");
            num_tasks_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    // Update the label that says how much RAM is used by each task
    // $("#task-ram").on("keyup", function () {
    //     let task_ram_input_el = $(this);
    //     let task_ram_input_value = parseInt(task_ram_input_el.val());
    //     let task_ram_label_el = $(".mcit-task-ram-label");
    //
    //     if (task_ram_input_value >= 0 && task_ram_input_value <= 32) {
    //
    //         task_ram_label_el.text(task_ram_input_value + "GB")
    //             .css("background-color", "#d3ffe9");
    //
    //         task_ram_input_el.removeClass("is-invalid")
    //             .addClass("is-valid");
    //
    //         setTimeout(function () {
    //             if (task_ram_label_el.css("background-color") == "rgb(211, 255, 233)") {
    //                 task_ram_label_el.css("background-color", "");
    //             }
    //         }, 500);
    //     } else {
    //         task_ram_label_el.css("background-color", "#ffb7b5");
    //         task_ram_input_el.removeClass("is-valid")
    //             .addClass("is-invalid");
    //     }
    // });

    // Update the label that says how much GFlop each task is. Converts to TFlop to save space if it gets too large.
    $("#mcit-task-gflop").on("keyup", function () {
        let task_gflop_input_el = $(this);
        let task_gflop_input_value = parseInt(task_gflop_input_el.val());
        let task_gflop_label_el = $(".mcit-task-gflop-label");

        if (task_gflop_input_value >= 1 && task_gflop_input_value < 1000) {

            task_gflop_label_el.text(task_gflop_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_gflop_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else if (task_gflop_input_value >= 1000 && task_gflop_input_value < 1000000) {
            task_gflop_label_el.text(task_gflop_input_value / 1000 + " TFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_gflop_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task_gflop_label_el.css("background-color", "#ffb7b5");
            task_gflop_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form-mcit').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/multi_core_independent_tasks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_cores: $("#mcit-num-cores").val(),
                    num_tasks: $("#mcit-num-tasks").val(),
                    task_gflop: $("#mcit-task-gflop").val(),
                    task_ram: 0,
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#mcit-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData);
                generateHostUtilizationChart(executionData, 'mcit-host-utilization-chart');

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");

            }
        });
    });
});

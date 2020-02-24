

$(function() {

    // Update the label that says how many tasks will be run
    $("#num-tasks").on("keyup", function() {
        let num_tasks_input_el = $(this);
        let num_tasks_input_value = parseInt(num_tasks_input_el.val());
        let num_tasks_label_el = $(".num-tasks-label");

        if (num_tasks_input_value >= 1 && num_tasks_input_value <1000) {

            num_tasks_label_el.text(num_tasks_input_value + " Task(s)")
                .css("background-color", "#d3ffe9");

            num_tasks_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
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

    // Update the label that says how much GFlop each task is. Converts to TFlop to save space if it gets too large.
    $("#task-gflop").on("keyup", function() {
        let task_gflop_input_el = $(this);
        let task_gflop_input_value = parseInt(task_gflop_input_el.val());
        let task_gflop_label_el = $(".task-gflop-label");

        if (task_gflop_input_value >= 1 && task_gflop_input_value<1000) {

            task_gflop_label_el.text(task_gflop_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
                if (task_gflop_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_gflop_label_el.css("background-color", "");
                }
            }, 500);
        } else if(task_gflop_input_value>=1000 && task_gflop_input_value<1000000){
            task_gflop_label_el.text(task_gflop_input_value/1000 + " TFlop")
                .css("background-color", "#d3ffe9");

            task_gflop_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
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

    // Update the label that says how much input data must be read from disk for each task.
    $("#task-input").on("keyup", function() {
        let task_input_input_el = $(this);
        let task_input_input_value = parseInt(task_input_input_el.val());
        let task_input_label_el = $(".task-input-label");

        if(task_input_input_value>=1 && task_input_input_value<1000){
            task_input_label_el.text("In: " + task_input_input_value + "MB")
                .css("background-color", "#d3ffe9");

            task_input_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
                if (task_input_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_input_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task_input_label_el.css("background-color", "#ffb7b5");
            task_input_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    // Update the label that says how much output data must be written to disk for each task.
    $("#task-output").on("keyup", function() {
        let task_output_input_el = $(this);
        let task_output_input_value = parseInt(task_output_input_el.val());
        let task_output_label_el = $(".task-output-label");

        if(task_output_input_value>=1 && task_output_input_value<1000){
            task_output_label_el.text("Out: " + task_output_input_value + "MB")
                .css("background-color", "#d3ffe9");

            task_output_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
                if (task_output_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_output_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task_output_label_el.css("background-color", "#ffb7b5");
            task_output_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form').on('submit', function(event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        $('.chart').css('display', 'block');

        // remove the graphs, since we will append a new ones to the chart
        $('.chart > svg').remove();

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: '/run/io_operations',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    task_input: $("#task-input").val(),
                    task_output: $("#task-output").val(),
                    num_tasks: $("#num-tasks").val(),
                    task_gflop: $("#task-gflop").val(),
                    io_overlap: $('#io-overlap').is(':checked') ? true : false
                }),

            success: function(response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty()
                    .append(response.simulation_output);

                generate_host_utilization_graph(response.task_data, 1);

                generate_workflow_execution_graph(response.task_data);

                populateWorkflowTaskDataTable(response.task_data);
            }
        });
    });
});

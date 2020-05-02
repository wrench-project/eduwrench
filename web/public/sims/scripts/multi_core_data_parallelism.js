$(function () {

    // Update the label that says how many tasks will be run
    $("#oil-radius").on("keyup", function () {
        let oil_radius_input_el = $(this);
        let oil_radius_input_value = parseInt(oil_radius_input_el.val());
        let task_1_label_el = $(".oil-task-1-label");
        let task_2_label_el = $(".oil-task-2-label");

        if (oil_radius_input_value >= 1 && oil_radius_input_value <= 10) {

            task_1_label_el.text((oil_radius_input_value * oil_radius_input_value *  100).toString() + " GFlop")
                .css("background-color", "#d3ffe9");
            task_2_label_el.text((oil_radius_input_value * oil_radius_input_value *  100).toString() + " GFlop")
                .css("background-color", "#d3ffe9");


            oil_radius_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_1_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_1_label_el.css("background-color", "");
                }
                if (task_2_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    task_2_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            task_1_label_el.css("background-color", "#ffb7b5");
            task_2_label_el.css("background-color", "#ffb7b5");
            oil_radius_input_value.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#num-cores").on("keyup", function () {
        let num_cores_input_el = $(this);
        let num_cores_input_value = parseInt(num_cores_input_el.val());
        let num_cores_label_el = $(".num-cores-label");
        let data_parallelism_label_el = $(".data-parallelism-label");


        if (num_cores_input_value >= 1 && num_cores_input_value <= 100) {

            num_cores_label_el.text("Cores: " + num_cores_input_value)
                .css("background-color", "#d3ffe9");
            data_parallelism_label_el.text("Data-parallelism with " + num_cores_input_value + " tasks")
                .css("background-color", "#d3ffe9");

            num_cores_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_label_el.css("background-color", "");
                }
                if (data_parallelism_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    data_parallelism_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_label_el.css("background-color", "#ffb7b5");
            num_cores_input_el.removeClass("is-valid")
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/multi_core_data_parallelism',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_cores: $("#num-cores").val(),
                    oil_radius: $("#oil-radius").val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty().append(response.simulation_output);

                // console.log(response.task_data.workflow_execution.tasks);

                let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                generateGraph(prepared_data, "workflow-execution-chart", "taskView", 900, 500);
                generateHostUtilizationGraph(prepared_data, "host-utilization-chart", "host-utilization-chart-tooltip",
                    "host-utilization-chart-tooltip-task-id", "host-utilization-chart-tooltip-compute-time",
                    900, 300);
                populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                    "task-details-table-td");
            }
        });
    });
});

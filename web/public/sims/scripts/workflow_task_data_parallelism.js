$(function () {

    $("#wf-parallel-num-cores-blue").on("keyup", function () {
        let num_cores_blue_input_el = $(this);
        let num_cores_blue_input_value = parseInt(num_cores_blue_input_el.val());
        let num_cores_blue_label_el = $(".num-cores-blue-label");

        if (num_cores_blue_input_value >= 1 && num_cores_blue_input_value <= 3) {


            num_cores_blue_label_el.text((num_cores_blue_input_value).toString() +
                (num_cores_blue_input_value == 1 ? " core" : " cores"))
                .css("background-color", "#d3ffe9");

            num_cores_blue_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_blue_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_blue_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_blue_label_el.css("background-color", "#ffb7b5");
            num_cores_blue_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#wf-parallel-num-cores-yellow").on("keyup", function () {
        let num_cores_yellow_input_el = $(this);
        let num_cores_yellow_input_value = parseInt(num_cores_yellow_input_el.val());
        let num_cores_yellow_label_el = $(".num-cores-yellow-label");

        if (num_cores_yellow_input_value >= 1 && num_cores_yellow_input_value <= 3) {

            num_cores_yellow_label_el.text((num_cores_yellow_input_value).toString() +
                (num_cores_yellow_input_value == 1 ? " core" : " cores"))
                .css("background-color", "#d3ffe9");

            num_cores_yellow_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_yellow_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_yellow_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_yellow_label_el.css("background-color", "#ffb7b5");
            num_cores_yellow_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#wf-parallel-num-cores-purple").on("keyup", function () {
        let num_cores_purple_input_el = $(this);
        let num_cores_purple_input_value = parseInt(num_cores_purple_input_el.val());
        let num_cores_purple_label_el = $(".num-cores-purple-label");

        if (num_cores_purple_input_value >= 1 && num_cores_purple_input_value <= 3) {

            num_cores_purple_label_el.text((num_cores_purple_input_value).toString() +
                (num_cores_purple_input_value == 1 ? " core" : " cores"))
                .css("background-color", "#d3ffe9");

            num_cores_purple_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_purple_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_purple_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_purple_label_el.css("background-color", "#ffb7b5");
            num_cores_purple_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form-wf-parallel').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/workflow_task_data_parallelism',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_cores_blue: $("#wf-parallel-num-cores-blue").val(),
                    num_cores_yellow: $("#wf-parallel-num-cores-yellow").val(),
                    num_cores_purple: $("#wf-parallel-num-cores-purple").val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#wf-parallel-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData, 'wf-parallel-graph-container');
                generateHostUtilizationChart(executionData, 'wf-parallel-host-utilization-chart', [], [], false);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

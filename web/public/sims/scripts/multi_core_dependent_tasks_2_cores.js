$(function () {

    // Update the label that says how many tasks will be run
    $("#mcdt2-analyze-work").on("keyup", function () {
        let analyze_work_input_el = $(this);
        let analyze_work_input_value = parseInt(analyze_work_input_el.val());
        let analyze_work_label_el = $(".analyze-work-label");

        if (analyze_work_input_value >= 10 && analyze_work_input_value < 1000) {

            analyze_work_label_el.text(analyze_work_input_value + " GFlop")
                .css("background-color", "#d3ffe9");

            analyze_work_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (analyze_work_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    analyze_work_label_el.css("background-color", "");
                }
            }, 500);
        } else if (analyze_work_input_value < 10000) {
            analyze_work_label_el.text(analyze_work_input_value / 1000 + " TFlop")
                .css("background-color", "#d3ffe9");

            analyze_work_input_value.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (analyze_work_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    analyze_work_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            analyze_work_label_el.css("background-color", "#ffb7b5");
            analyze_work_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form-mcdt2').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/multi_core_dependent_tasks',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_cores: "2",
                    analyze_work: $("#mcdt2-analyze-work").val(),
                    scheduling_scheme: $('input[name="mcdt2-scheduling-scheme-select"]:checked').val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#mcdt2-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData, 'mcdt2-graph-container');
                generateHostUtilizationChart(executionData, 'mcdt2-host-utilization-chart',
                    hostsList = [], diskHostsList = [], zoom = false);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

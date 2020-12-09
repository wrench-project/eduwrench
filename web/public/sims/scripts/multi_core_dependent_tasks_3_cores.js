$(function () {

    // Update the label that says how many tasks will be run
    $("#mcdt3-analyze-work").on("keyup", function () {
        validateFieldInRange($(this), 10, 1000, [{className: ".mcdt3-analyze-work-label", text: "GFlop"}]);
    });

    $('#simulator-form-mcdt3').on('submit', function (event) {
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
                    num_cores: "3",
                    analyze_work: $("#mcdt3-analyze-work").val(),
                    scheduling_scheme: "viz",
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#mcdt3-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData, 'mcdt3-graph-container');
                generateHostUtilizationChart(executionData, 'mcdt3-host-utilization-chart',
                    hostsList = [], diskHostsList = [], zoom = false);
                hostUtilizationData = {
                    data: executionData,
                    containedId: 'mcdt3-host-utilization-chart',
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

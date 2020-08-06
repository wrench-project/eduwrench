$(function () {

    updateFigureLabel("server-1-startup", "server-1-overhead-label", 0, 10, "Startup overhead", "sec");
    updateFigureLabel("server-2-startup", "server-2-overhead-label", 0, 10, "Startup overhead", "sec");
    updateFigureLabel("task-work", "task-work-label", 100, 2000, "", "GFlop");

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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/ci_overhead',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    compute_1_startup: $("#server-1-startup").val(),
                    compute_2_startup: $("#server-2-startup").val(),
                    server_1_link_bandwidth: "10",
                    server_2_link_bandwidth: "100",
                    server_1_link_latency: "10",
                    file_size: "100",
                    task_work: $("#task-work").val(),
                    host_select: $('input[name=host-select]:checked').val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty().append(response.simulation_output);

                // console.log(response.task_data.workflow_execution.tasks);

                // let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData);
                // generateHostUtilizationChart(executionData);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

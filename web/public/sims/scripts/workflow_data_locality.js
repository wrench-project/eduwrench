$(function () {

    $("#wf-locality-num-hosts").on("keyup", function () {
        validateFieldInRange($(this), 1, 20, [{
            className: ".wf-locality-num-hosts-label",
            pretext: "N =",
            text: "Host(s)"
        }]);
    });

    $("#wf-locality-num-cores").on("keyup", function () {
        validateFieldInRange($(this), 1, 20, [{className: ".wf-locality-num-cores-label", pretext: "Cores:"}]);
    });

    $("#wf-locality-link-bandwidth").on("keyup", function () {
        validateFieldInRange($(this), 1, 500, [{
            className: ".wf-locality-link-bandwidth-label",
            pretext: "Bandwidth:",
            text: "MB/sec"
        }]);
    });

    $('#simulator-form-wf-locality').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/workflow_distributed',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_hosts: $("#wf-locality-num-hosts").val(),
                    num_cores: $("#wf-locality-num-cores").val(),
                    link_bandwidth: $("#wf-locality-link-bandwidth").val(),
                    use_local_storage: $('#wf-locality-remote-storage-service-input').is(':checked') ? "1" : "0",
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#wf-locality-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData, 'wf-locality-graph-container');
                generateHostUtilizationChart(executionData, 'wf-locality-host-utilization-chart', [], [], false);

                let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                populateWorkflowTaskDataTable(prepared_data, 'wf-locality-task-details-table');

                generateBandwidthUsage(executionData, dataSizeUnits.MB, 'wf-locality-network-bandwidth-chart', false,
                    ["wide_area_link"], null);
            }
        });
    });
});

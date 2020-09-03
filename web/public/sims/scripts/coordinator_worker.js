$(function () {
    $('#simulator-form-coordinator-worker').on('submit', function (event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        $('.chart').css('display', 'block');
        // remove the graphs, since we will append a new ones to the chart
        $('.chart > svg').remove();

        // get google user information
        let userName = localStorage.getItem("userName");
        let email = localStorage.getItem("email");

        // Fix the task spec so that the output is set to zero
        // console.log("ORIGINAL TASK SPEC: " + $("#task-specs").val());
        let fixed_task_specs = "";
        let tokens = $("#cw-task-specs").val().split(",");
        for (let i = 0; i < tokens.length; i++) {
            fixed_task_specs += tokens[i] + " 0";
            if (i < tokens.length - 1) {
                fixed_task_specs += ",";
            }
        }

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/coordinator_worker',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    host_specs: $("#cw-host-specs").val(),
                    task_specs: fixed_task_specs,
                    num_workers: $("#cw-num-workers").val(),
                    min_worker_flops: $("#cw-min-worker-flops").val(),
                    max_worker_flops: $("#cw-max-worker-flops").val(),
                    min_worker_band: $("#cw-min-worker-band").val(),
                    max_worker_band: $("#cw-max-worker-band").val(),
                    num_tasks: $("#cw-num-tasks").val(),
                    min_task_input: $("#cw-min-task-input").val(),
                    max_task_input: $("#cw-max-task-input").val(),
                    min_task_flop: $("#cw-min-task-flop").val(),
                    max_task_flop: $("#cw-max-task-flop").val(),
                    min_task_output: 0,
                    max_task_output: 0,
                    task_scheduling_select: $('input[name=cw-task-scheduling-select]:checked').val(),
                    compute_scheduling_select: $('input[name=cw-compute-scheduling-select]:checked').val(),
                    num_invocation: $("#cw-invocations").val(),
                    seed: $("#cw-seed").val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {
                $("#cw-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                generateGanttChart(executionData, 'cw-graph-container', true, {
                    read: {display: true, label: "Receiving Input"},
                    compute: {display: true, label: "Computing"},
                    write: {display: false, label: ""},
                });
                generateHostUtilizationChart(executionData, 'cw-host-utilization-chart');

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

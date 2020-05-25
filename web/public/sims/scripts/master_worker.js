$(function () {
    $('#simulator-form').on('submit', function (event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        let invocation_value = $("#invocations").val();

        if (invocation_value == 1) {
            $('.chart').css('display', 'block');
            // remove the graphs, since we will append a new ones to the chart
            $('.chart > svg').remove();
        }
        // get google user information
        let userName = localStorage.getItem("userName");
        let email = localStorage.getItem("email");
        

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/master_worker',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    host_specs: $("#host-specs").val(),
                    task_specs: $("#task-specs").val(),
                    num_workers: $("#num-workers").val(),
                    min_worker_flops: $("#min-worker-flops").val(),
                    max_worker_flops: $("#max-worker-flops").val(),
                    min_worker_band: $("#min-worker-band").val(),
                    max_worker_band: $("#max-worker-band").val(),
                    num_tasks: $("#num-tasks").val(),
                    min_task_input: $("#min-task-input").val(),
                    max_task_input: $("#max-task-input").val(),
                    min_task_flop: $("#min-task-flop").val(),
                    max_task_flop: $("#max-task-flop").val(),
                    min_task_output: $("#min-task-output").val(),
                    max_task_output: $("#max-task-output").val(),
                    task_scheduling_select: $('input[name=task-scheduling-select]:checked').val(),
                    compute_scheduling_select: $('input[name=compute-scheduling-select]:checked').val(),
                    num_invocation: $("#invocations").val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {
                if(invocation_value==1) {
                    $("#simulation-output").empty().append(response.simulation_output);

                    let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                    generateGraph(prepared_data, "taskView", 900, 500);
                    generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                    populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                        "task-details-table-td");
                } else {
                    console.log("got here");
                    console.log(response.simulation_output);
                    $("#simulation-output").empty().append(response.simulation_output);
                }

            }
        });
    });
});

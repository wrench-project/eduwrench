$(function () {
    $('#simulator-form-coordinator-worker-generated').on('submit', function (event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        // get google user information
        let userName = localStorage.getItem("userName");
        let email = localStorage.getItem("email");

        // Fix the task spec so that the output is set to zero
        // console.log("ORIGINAL TASK SPEC: " + $("#task-specs").val());
        let fixed_task_specs = "";
        let tokens = $("#cwg-task-specs").val().split(",");
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
                    host_specs: $("#cwg-host-specs").val(),
                    task_specs: fixed_task_specs,
                    num_workers: $("#cwg-num-workers").val(),
                    min_worker_flops: $("#cwg-min-worker-flops").val(),
                    max_worker_flops: $("#cwg-max-worker-flops").val(),
                    min_worker_band: $("#cwg-min-worker-band").val(),
                    max_worker_band: $("#cwg-max-worker-band").val(),
                    num_tasks: $("#cwg-num-tasks").val(),
                    min_task_input: $("#cwg-min-task-input").val(),
                    max_task_input: $("#cwg-max-task-input").val(),
                    min_task_flop: $("#cwg-min-task-flop").val(),
                    max_task_flop: $("#cwg-max-task-flop").val(),
                    min_task_output: 0,
                    max_task_output: 0,
                    task_scheduling_select: $('input[name=cwg-task-scheduling-select]:checked').val(),
                    compute_scheduling_select: $('input[name=cwg-compute-scheduling-select]:checked').val(),
                    num_invocation: $("#cwg-invocations").val(),
                    seed: $("#cwg-seed").val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {
                $("#cwg-simulation-output").empty().append(response.simulation_output);
            }
        });
    });
});

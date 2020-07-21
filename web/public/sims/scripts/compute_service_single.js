$(function() {
    $("#task-flops").on("keyup", function () {
        let task_flops_input = $(this);
        let task_flops_value = parseInt(task_flops_input.val());
        let task_flops_label = $(".task-flops-label");

        if (task_flops_value >= 0 && task_flops_value <= 10000) {
            task_flops_label.text(task_flops_value + " Gflops")
                .css("background-color", "#d3ffe9");

            task_flops_input.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (task_flops_label.css("background-color") == "rgb(211, 255, 233)") {
                    task_flops_label.css("background-color", "");
                }
            }, 500);
        } else {
            task_flops_label.css("background-color", "#ffb7b5");
            task_flops_input.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#filesize-input").on("keyup", function () {
        let filesize_input = $(this);
        let filesize_label_value = parseInt(filesize_input.val());
        let filesize_label = $(".filesize-label");

        if (filesize_label_value >= 0 && filesize_label_value <= 10000) {
            filesize_label.text(filesize_label_value + " MB")
                .css("background-color", "#d3ffe9");

            filesize_input.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (filesize_label.css("background-color") == "rgb(211, 255, 233)") {
                    filesize_label.css("background-color", "");
                }
            }, 500);
        } else {
            filesize_label.css("background-color", "#ffb7b5");
            filesize_input.removeClass("is-valid")
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

        // get google user information
        let userName = localStorage.getItem("userName");
        let email = localStorage.getItem("email");

        var formInput = {
            userName: userName,
            email: email,
            hostSelect: $("input[name*='host-select']:checked").val(),
            taskFlops: $("#task-flops").val(),
            fileSize: $("#file-size").val()
        };

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/compute_service_single_task',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formInput),

            success: function(response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty().append(response.simulation_output);

                console.log(response.task_data.workflow_execution.tasks);
                console.log(formInput);

                let executionData = prepareResponseData(response.task_data);
                generateGanttChart(executionData, false);
                generateHostUtilizationChart(executionData, [], [], false);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

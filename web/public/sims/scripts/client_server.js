$(function () {
    $("#cs-server-1-link").on("keyup", function () {
        let server_1_link_input_el = $(this);
        let server_1_link_input_value = parseInt(server_1_link_input_el.val());
        let server_1_link_label_el = $(".cs-server-1-link-label");

        if (server_1_link_input_value >= 1 && server_1_link_input_value < 1000) {
            server_1_link_label_el.text("Bandwidth: " + server_1_link_input_value + " MB/sec")
                .css("background-color", "#d3ffe9");

            server_1_link_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (server_1_link_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    server_1_link_label_el.css("background-color", "");
                }
            }, 500);
        } else if (server_1_link_input_value >= 1000 && server_1_link_input_value <= 10000) {
            server_1_link_label_el.text("Bandwidth: " + server_1_link_input_value / 1000 + " GBps")
                .css("background-color", "#d3ffe9");

            server_1_link_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (server_1_link_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    server_1_link_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            server_1_link_label_el.css("background-color", "#ffb7b5");
            server_1_link_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form-client-server').on('submit', function (event) {
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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/client_server',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    server_1_link_bandwidth: $("#cs-server-1-link").val(),
                    server_2_link_bandwidth: "100",
                    server_1_link_latency: "10",
                    file_size: "100",
                    host_select: $('input[name=cs-host-select]:checked').val(),
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#cs-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
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

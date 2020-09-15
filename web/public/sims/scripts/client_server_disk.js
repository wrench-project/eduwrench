$(function () {
    $("#csd-server-1-link-latency").on("keyup", function () {
        let server_1_link_input_el = $(this);
        let server_1_link_input_value = parseInt(server_1_link_input_el.val());
        let server_1_link_label_el = $(".csd-server-1-link-latency-label");

        if (server_1_link_input_value >= 1 && server_1_link_input_value <= 10000) {
            server_1_link_label_el.text("Latency: " + server_1_link_input_value + " us")
                .css("background-color", "#d3ffe9");

            server_1_link_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (server_1_link_label_el.css("background-color") === "rgb(211, 255, 233)") {
                    server_1_link_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            server_1_link_label_el.css("background-color", "#ffb7b5");
            server_1_link_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#csd-buffer-size").on("keyup", function () {
        let buffer_size_input_el = $(this);
        let buffer_size_input_value = parseInt(buffer_size_input_el.val());
        let buffer_size_label_el = $(".csd-buffer-size-label");

        if (buffer_size_input_value >= 50000 && buffer_size_input_value < 1000000) {

            buffer_size_label_el.text(buffer_size_input_value / 1000 + " MB")
                .css("background-color", "#d3ffe9");

            buffer_size_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (buffer_size_label_el.css("background-color") === "rgb(211, 255, 233)") {
                    buffer_size_label_el.css("background-color", "");
                }
            }, 500);
        } else if (buffer_size_input_value === 1000000) {
            buffer_size_label_el.text(buffer_size_input_value / 1000000 + " GB")
                .css("background-color", "#d3ffe9");

            buffer_size_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (buffer_size_label_el.css("background-color") === "rgb(211, 255, 233)") {
                    buffer_size_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            buffer_size_label_el.css("background-color", "#ffb7b5");
            buffer_size_input_el.removeClass("is-valid")
                .addClass("is-invalid");
            // let run_simulation_button = $("#run-button");
            // run_simulation_button.attr("disabled", "disabled");
        }
    });

    $('#simulator-form-client-server-disk').on('submit', function (event) {

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
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/client_server_disk',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    server_1_link_latency: $("#csd-server-1-link-latency").val(),
                    server_1_link_bandwidth: 200,
                    server_2_link_bandwidth: 600,
                    file_size: "1000",
                    buffer_size: 1000 * $("#csd-buffer-size").val(),
                    host_select: $('input[name=csd-host-select]:checked').val(),
                    disk_speed: 400,
                    userName: userName,
                    email: email
                }),

            success: function (response) {
                // Add the new simulation output into the "Simulation Output" section
                $("#csd-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);

                // generateGanttChart(executionData, 'csd-graph-container');
                generateHostUtilizationChart(executionData, 'csd-host-utilization-chart', [], ['client'], false);

                let link_to_display = $('input[name=csd-host-select]:checked').val() === '1' ? 'link1' : 'link2';
                generateBandwidthUsage(executionData, dataSizeUnits.MB, 'csd-network-bandwidth-chart', false,
                    [link_to_display], null);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

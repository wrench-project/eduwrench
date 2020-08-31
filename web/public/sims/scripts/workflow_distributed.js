$(function () {

    $("#wf-dist-num-hosts").on("keyup", function () {
        let num_hosts_input_el = $(this);
        let num_hosts_input_value = parseInt(num_hosts_input_el.val());
        let num_hosts_label_el = $(".wf-dist-num-hosts-label");

        if (num_hosts_input_value >= 1 && num_hosts_input_value <= 20) {

            num_hosts_label_el.text("N=" + (num_hosts_input_value).toString() + " Hosts")
                .css("background-color", "#d3ffe9");

            num_hosts_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_hosts_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_hosts_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_hosts_label_el.css("background-color", "#ffb7b5");
            num_hosts_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $("#wf-dist-num-cores").on("keyup", function () {
        let num_cores_input_el = $(this);
        let num_cores_input_value = parseInt(num_cores_input_el.val());
        let num_cores_label_el = $(".wf-dist-num-cores-label");


        if (num_cores_input_value >= 1 && num_cores_input_value <= 32) {

            num_cores_label_el.text("Cores: " + num_cores_input_value.toString())
                .css("background-color", "#d3ffe9");

            num_cores_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function () {
                if (num_cores_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_label_el.css("background-color", "#ffb7b5");
            num_cores_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form-wf-dist').on('submit', function (event) {
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
                    num_hosts: $("#wf-dist-num-hosts").val(),
                    num_cores: $("#wf-dist-num-cores").val(),
                    link_bandwidth: "100",
                    use_local_storage: "0",
                    userName: userName,
                    email: email
                }),

            success: function (response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#wf-dist-simulation-output").empty().append(response.simulation_output);

                let executionData = prepareResponseData(response.task_data);
                // generateGanttChart(executionData, 'wf-dist-graph-container');
                generateHostUtilizationChart(executionData, 'wf-dist-host-utilization-chart');

                let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                populateWorkflowTaskDataTable(prepared_data, 'wf-dist-task-details-table');
            }
        });
    });
});

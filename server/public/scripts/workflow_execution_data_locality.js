"use strict";

// Workflow as a DAG
var workflow_dag =
    {
        "edges": [
            {
                "source": "task0::0.in",
                "target": "task0"
            },
            {
                "source": "task0",
                "target": "task0::0.out"
            },
            {
                "source": "task0",
                "target": "task0::1.out"
            },
            {
                "source": "task0",
                "target": "task0::2.out"
            },
            {
                "source": "task0::0.out",
                "target": "task1"
            },
            {
                "source": "task0::1.out",
                "target": "task2"
            },
            {
                "source": "task0::2.out",
                "target": "task3"
            },
            {
                "source": "task1",
                "target": "task1::0.out"
            },
            {
                "source": "task2",
                "target": "task2::0.out"
            },
            {
                "source": "task3",
                "target": "task3::0.out"
            },
            {
                "source": "task1::0.out",
                "target": "task4"
            },
            {
                "source": "task2::0.out",
                "target": "task4"
            },
            {
                "source": "task3::0.out",
                "target": "task4"
            },
            {
                "source": "task4",
                "target": "task4::0.out"
            },
        ],
        "vertices": [
            {
                "flops": 50e+12,
                "id": "task0",
                "max_cores": 1,
                "memory": 0,
                "min_cores": 1,
                "parallel_efficiency": 1.0,
                "type": "task"
            },
            {
                "flops": 40e+12,
                "id": "task1",
                "max_cores": 1,
                "memory": 0,
                "min_cores": 1,
                "parallel_efficiency": 1.0,
                "type": "task"
            },
            {
                "flops": 35e+12,
                "id": "task2",
                "max_cores": 1,
                "memory": 0,
                "min_cores": 1,
                "parallel_efficiency": 1.0,
                "type": "task"
            },
            {
                "flops": 20e+12,
                "id": "task3",
                "max_cores": 1,
                "memory": 0,
                "min_cores": 1,
                "parallel_efficiency": 1.0,
                "type": "task"
            },
            {
                "flops": 10e+12,
                "id": "task4",
                "max_cores": 1,
                "memory": 0,
                "min_cores": 1,
                "parallel_efficiency": 1.0,
                "type": "task"
            },

            {
                "id": "task0::0.in",
                "size": 700000000.0,
                "type": "file"
            },
            {
                "id": "task0::0.out",
                "size": 100000000.0,
                "type": "file"
            },
            {
                "id": "task0::1.out",
                "size": 200000000.0,
                "type": "file"
            },
            {
                "id": "task0::2.out",
                "size": 400000000.0,
                "type": "file"
            },
            {
                "id": "task1::0.out",
                "size": 120000000.0,
                "type": "file"
            },
            {
                "id": "task2::0.out",
                "size": 200000000.0,
                "type": "file"
            },
            {
                "id": "task3::0.out",
                "size": 200000000.0,
                "type": "file"
            },
            {
                "id": "task4::0.out",
                "size": 100000000.0,
                "type": "file"
            },

        ]
    };

$(function() {

    // Show the workflow, and update if the user wants to use the Workflow where tasks use RAM
    generate_workflow_dag(workflow_dag);

    // Initially hide the label that says "Local Storage Service"
    $('.local-storage-service-label').css('display', 'none');

    // Hide or display the "Local Storage Service" label
    $("#remote-storage-service-input").on("click", function() {
        $('.local-storage-service-label').css('display', 'none');
    });

    $("#local-storage-service-input").on("click", function() {
        $('.local-storage-service-label').css('display', 'block');
    });

    // Update link bandwidths labels on SVG live as user types into
    // the form
    $('#link-bandwidth').on('keyup', function() {

        let link_bandwidth_input_el = $(this)
        let link_bandwidth_input_value = parseInt(link_bandwidth_input_el.val());
        let link_bandwidth_label_el = $(".bandwidth-label");

        // highlight the bandwidth label using green on the SVG for half a second
        //to indicate to the user that a valid number has been entered
        if (link_bandwidth_input_value >= 1 && link_bandwidth_input_value <= 999) {
           link_bandwidth_label_el.text("Bandwidth: " + link_bandwidth_input_value + " MBps")
                .css("background-color", "#d3ffe9");

            link_bandwidth_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
                if (link_bandwidth_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    link_bandwidth_label_el.css("background-color", "");
                }
            }, 500);

        // highlight the bandwidth label using red on the SVG to indicate to the user
        // that an invalid number has been entered
        } else {
            link_bandwidth_label_el.css("background-color", "#ffb7b5");

            link_bandwidth_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form').on('submit', function(event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        // Display the chart element, which will enlarge the workflow execution block
        $('.chart').css("display", "block");

        // After each submission, remove the "old" chart, because we will generate a new one
        $('#workflow-execution-chart > svg').remove();

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen. 
        $.ajax({
            url: '/run/workflow_execution_data_locality',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    simulator_number: $('#simulator-form input:radio:checked').val(),
                    link_bandwidth: $('#link-bandwidth').val()
                }),

                success: function(response) {

                    // Add the new simulation output into the "Simulation Output" section
                    $("#simulation-output").empty()
                        .append(response.simulation_output);

                    generate_workflow_execution_graph(response.task_data);

                    populateWorkflowTaskDataTable(response.task_data);
                }
        });
    });
});

$(document).ready(function() {
  $('input[name="scenario-select"]').click(function() {
    if($(this).val() == '1') {
        $('#probability').show();
      } else {
        $('#probability').hide();
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
  });

$(function() {
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
            scenarioSelect: $("input[name*='scenario-select']:checked").val(),
            probability: $("#probability-input").val(),
            fileSize: $("#filesize-input").val()
        };

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/data_integrity',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formInput),

            success: function(response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty().append(response.simulation_output);

                console.log(response.task_data.workflow_execution.tasks);

                // let prepared_data = prepareData(response.task_data.workflow_execution.tasks);
                // generateGraph(prepared_data, "taskView", 900, 500);
                // generateHostUtilizationGraph(prepared_data, 900, 300, 60);
                // populateWorkflowTaskDataTable(prepared_data, "task-details-table", "task-details-table-body",
                //     "task-details-table-td");
            }
        });
    });
});

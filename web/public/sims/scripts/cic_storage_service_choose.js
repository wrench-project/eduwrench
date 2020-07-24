$(document).ready(function() {
    $('input[name="nps-num-server"]').click(function() {
      var choose = "";
      var input = "";
      var count = $(this).val();

      choose += "<label>Choose which server to download file from</label>";

      for (var i = 1; i <= count; ++i) {
        choose += "<div class=\"field\">" +
                    "<div class=\"ui radio checkbox\">" +
                      "<input type=\"radio\" name=\"nps-select-server\" id=\"nps-select-server\" value=\"" + i + "\">" +
                        "<label class=\"radio-inline control-label\" for=\"nps-select-server\">" + i +
                        "</label>" +
                      "</div>" +
                    "</div>";

        input += "<label for=\"bandwidth" + i + "\">Link Speed to Server #" + i + " (MBps)</label>" +
                  "<input name=\"bandwidth" + i + "\" class=\"form-control\" type=\"number\" id=\"bandwidth" + i + "\" placeholder=\"\" value=\"10\" min=\"1\" max=\"10000\" step=\"1\" required>" +
                  "<div class=\"invalid-feedback\">" +
                  "Please provide the link speed from the Client to Server #1 in MBps." +
                  "</div>";
      }

      $('#generate-servers').html(choose);
      $('#generate-servers-input').html(input);
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
            useNPS: 'f',
            chosenServer: $("input[name*='nps-select-server']:checked").val(),
            numServers: $("input[name*='nps-num-server']:checked").val(),
            bandwidth1: $("#bandwidth1").val(),
            bandwidth2: $("#bandwidth2").val(),
            bandwidth3: $("#bandwidth3").val(),
            bandwidth4: $("#bandwidth4").val(),
            bandwidth5: $("#bandwidth5").val(),
        };


        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/storage_service_multiple',
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

$(document).ready(function() {
  var checkboxes = jQuery('input[type="checkbox"]');

  checkboxes.change(function(){
    var current = checkboxes.filter(':checked').length;
    checkboxes.filter(':not(:checked)').prop('disabled', current >= 2);
    var input = $(this).val();
    $("#" + input).toggle();
  });

  checkboxes.click(function(){
    var input = $(this).val();
    if (input == "b") {
      for (var i = 1; i <= 5; ++i) {
        $("#bandwidth" + i).val("10");
      }
    } else if (input == "p") {
      $("#property1").val("0");
      $("#property2").val("0");
      $("#property3").val("500000");
      $("#property4").val("0");
    } else if (input == "c") {
      for (var i = 1; i <= 4; ++i) {
        $("#cores" + i).val("1");
      }
    } else if (input == "m") {
      for (var i = 1; i <= 4; ++i) {
        $("#mem" + i).val("0");
      }
    } else if (input == "f") {
      $("#file-num").val("1");
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
        var userName = localStorage.getItem("userName");
        var email = localStorage.getItem("email");
        var b = $("#selectb").is(":checked") ? "b" : "";
        var p = $("#selectp").is(":checked") ? "p" : "";
        var c = $("#selectc").is(":checked") ? "c" : "";
        var m = $("#selectm").is(":checked") ? "m" : "";
        var f = $("#selectf").is(":checked") ? "f" : "";
        var param = b + p + c + m + f;

        var formInput = {
            userName: userName,
            email: email,
            paramSelect: param,
            bandwidth1: $("#bandwidth1").val(),
            bandwidth2: $("#bandwidth2").val(),
            bandwidth3: $("#bandwidth3").val(),
            bandwidth4: $("#bandwidth4").val(),
            bandwidth5: $("#bandwidth5").val(),
            property1: $("#property1").val(),
            property2: $("#property2").val(),
            property3: $("#property3").val(),
            property4: $("#property4").val(),
            cores1: $("#cores1").val(),
            cores2: $("#cores2").val(),
            cores3: $("#cores3").val(),
            cores4: $("#cores4").val(),
            mem1: $("#mem1").val(),
            mem2: $("#mem2").val(),
            mem3: $("#mem3").val(),
            mem4: $("#mem4").val(),
            fileNum: $("#file-num").val()
        };

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: window.location.protocol + '//' + window.location.hostname + ':3000/run/compute_service_properties',
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

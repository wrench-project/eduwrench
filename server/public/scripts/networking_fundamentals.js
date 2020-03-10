"use strict";

function stringIsInteger(str) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

function  is_valid_list(str) {
    let value_lists = str.replace(/,/g," ").replace(/ +/g," ").trim().split(" ");

    if  (value_lists.length < 1) {
        return false;
    }
    for (let i=0; i < value_lists.length; i++) {
       if (! stringIsInteger(value_lists[i])) {
           return false;
        }
    }
    return true;
}

$(function() {

    // Check that input is valid
    $('#file-sizes').on('keyup', function() {

        let file_sizes_input_el = $(this)
        let file_sizes_input_value = file_sizes_input_el.val();
        let file_sizes_label_el = $(".filesizes-label");

        if (is_valid_list(file_sizes_input_value)) {

            file_sizes_input_el.removeClass("is-invalid")
                .addClass("is-valid");
            let run_simulation_button = $("#run-button");
            run_simulation_button.attr("disabled", "enabled");
            run_simulation_button.removeAttr("disabled");

        } else {

            file_sizes_label_el.css("background-color", "#ffb7b5");
            file_sizes_input_el.removeClass("is-valid")
                .addClass("is-invalid");
            let run_simulation_button = $("#run-button");
            run_simulation_button.attr("disabled", "disabled");

        }

    });


    $('#simulator-form').on('submit', function(event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen.
        $.ajax({
            url: '/run/networking_fundamentals',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    file_sizes: $('#file-sizes').val()
                }),

            success: function(response) {

                // Add the new simulation output into the "Simulation Output" section
                $("#simulation-output").empty()
                    .append(response.simulation_output);
            }
        });
    });
});

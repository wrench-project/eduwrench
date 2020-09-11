$(document).ready(function () {
    var checkboxes = jQuery('input[type="checkbox"]');

    checkboxes.change(function () {
        var current = checkboxes.filter(':checked').length;
        checkboxes.filter(':not(:checked)').prop('disabled', current >= 2);
        var input = $(this).val();
        $("#" + input).toggle();
    });

    checkboxes.click(function () {
        let bandwidths = ["100", "10", "100", "200", "500"];
        let property = ["0", "0", "500000", "0"];
        if ($("#selectb").prop("checked") == false) {
            for (var i = 1; i <= 5; ++i) {
                $("#bandwidth" + i).val(bandwidths[i - 1]);
                $(".bandwidth" + i + "-label").text(bandwidths[i - 1] + "MBps");
            }
        } else {
            $("#bandwidth1").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".bandwidth1-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "MBps")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#bandwidth2").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".bandwidth2-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "MBps")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#bandwidth3").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".bandwidth3-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "MBps")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#bandwidth4").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".bandwidth4-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "MBps")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#bandwidth5").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".bandwidth5-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "MBps")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
        }
        if ($("#selectp").prop("checked") == false) {
            for (var i = 1; i <= 4; ++i) {
                $("#property" + i).val(property[i - 1]);
                $(".startup" + i + "-label").text(property[i - 1] + " secs");
            }
        } else {
            $("#property1").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".startup1-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " secs")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#property2").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".startup2-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " secs")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
        }

        if ($("#selectc").prop("checked") == false) {
            for (var i = 1; i <= 4; ++i) {
                $("#cores" + i).val("1");
                $(".cores" + i + "-label").text("1 cores");
            }
        } else {
            $("#cores1").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".cores1-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " cores")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#cores2").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".cores2-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " cores")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#cores3").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".cores3-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " cores")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#cores4").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".cores4-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + " cores")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
        }

        if ($("#selectm").prop("checked") == false) {
            for (var i = 1; i <= 4; ++i) {
                $("#mem" + i).val("0");
                $(".mem" + i + "-label").text("10 GB");
            }
        } else {
            $("#mem1").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".mem1-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "GB")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#mem2").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".mem2-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "GB")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#mem3").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".mem3-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "GB")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
            $("#mem4").on("keyup", function () {
                let input = $(this);
                let value = parseInt(input.val());
                let label = $(".mem4-label");

                if (value >= 0 && value <= 10000) {
                    label.text(value + "GB")
                        .css("background-color", "#d3ffe9");

                    input.removeClass("is-invalid")
                        .addClass("is-valid");

                    setTimeout(function () {
                        if (label.css("background-color") == "rgb(211, 255, 233)") {
                            label.css("background-color", "");
                        }
                    }, 500);
                } else {
                    label.css("background-color", "#ffb7b5");
                    input.removeClass("is-valid")
                        .addClass("is-invalid");
                }
            });
        }

        if ($("#selectf").prop("checked") == false) {
            $("#file-num").val("1");
        }
    });
});

$(function () {

    $('#simulator-form-cic-compute-service-properties').on('submit', function (event) {
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

            success: function (response) {

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

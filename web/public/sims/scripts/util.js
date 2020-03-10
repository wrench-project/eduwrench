// Disable "Run Simulation" button for 5 seconds after submit
function disableRunSimulationButton() {
    let run_simulation_button = $("#run-button");

    run_simulation_button.attr("disabled", "disabled");
    setTimeout(function() {
        run_simulation_button.removeAttr("disabled");
    }, 5000);
}

/**
 * Format a number to Five decimal places. At the moment, 5 seems like a good number.
 * Anything less will make some start times look like 0.00 when it's something
 * like 0.00004
 */
var toFiveDecimalPlaces = d3.format('.5f');

/**
 * Populates the div with id #task-details-table with data obtained from
 * the simulation run. Data used in this function has been generated from
 * "void wrench::SimulationOutput::dumpWorkflowExecutionJSON(wrench::Workflow *workflow,
 *                                                           std::string file_path,
 *                                                           bool generate_host_utilization_layout)".
 *
 */
function populateWorkflowTaskDataTable(data) {

    // Reveal the Workflow Data table
    $("#task-details-table").css('display', 'block');

    let task_details_table_body = $("#task-details-table > tbody").empty();

    const TASK_DATA = Object.assign([], data).sort(function(lhs, rhs) {
        return parseInt(lhs.task_id.slice(4)) - parseInt(rhs.task_id.slice(4));
    });

    let total_read_input_time = 0;
    let total_compute_time = 0;
    let total_write_output_time = 0;

    TASK_DATA.forEach(function(task) {

        let task_id = task['task_id'];

        let read_start       = toFiveDecimalPlaces(task['read'].start);
        let read_end         = toFiveDecimalPlaces(task['read'].end);
        let read_duration    = toFiveDecimalPlaces(read_end - read_start);
        total_read_input_time += parseFloat(read_duration);

        let compute_start    = toFiveDecimalPlaces(task['compute'].start);
        let compute_end      = toFiveDecimalPlaces(task['compute'].end);
        let compute_duration = toFiveDecimalPlaces(compute_end - compute_start);
        total_compute_time += parseFloat(compute_duration);

        let write_start      = toFiveDecimalPlaces(task['write'].start);
        let write_end        = toFiveDecimalPlaces(task['write'].end);
        let write_duration   = toFiveDecimalPlaces(write_end - write_start);
        total_write_output_time += parseFloat(write_duration);

        let task_duration    = toFiveDecimalPlaces(write_end - read_start);

        task_details_table_body.append(
            '<tr id=' + task_id + '>'
            + '<td>' + task_id +'</td>'
            + '<td>' + read_start +'</td>'
            + '<td>' + read_end +'</td>'
            + '<td>' + read_duration +'</td>'
            + '<td>' + compute_start +'</td>'
            + '<td>' + compute_end +'</td>'
            + '<td>' + compute_duration +'</td>'
            + '<td>' + write_start +'</td>'
            + '<td>' + write_end +'</td>'
            + '<td>' + write_duration +'</td>'
            + '<td>' + task_duration +'</td>'
            + '</tr>'
        );
    });

    task_details_table_body.append(
      '<tr>'
      + '<td></td>'
      + '<td></td>'
      + '<td>Total Read Input Duration:</td>'
      + '<td>' + toFiveDecimalPlaces(total_read_input_time) +'</td>'
      + '<td></td>'
      + '<td>Total Compute Duration:</td>'
      + '<td>' + toFiveDecimalPlaces(total_compute_time) +'</td>'
      + '<td></td>'
      + '<td>Total Write Output Duration:</td>'
      + '<td>' + toFiveDecimalPlaces(total_write_output_time) +'</td>'
      + '<td></td>'
      + '</tr>'
    );
}

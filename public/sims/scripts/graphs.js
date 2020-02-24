/**
 * Format a number to Five decimal places. At the moment, 5 seems like a good number.
 * Anything less will make some start times look like 0.00 when it's something
 * like 0.00004
 */
var toFiveDecimalPlaces = d3.format('.5f');


/**
 * Helper function used to get the position of the mouse within the browser window
 * so that we can have nice moving tooltips. The input is the DOM element we are
 * interested in (in this case the #chart element).
 */
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

/**
 * Takes in data generated from
 * "void wrench::SimulationOutput::dumpWorkflowExecutionJSON(wrench::Workflow *workflow,
 *                                                           std::string file_path,
 *                                                           bool generate_host_utilization_layout)"
 * and generates a workflow execution Gantt chart, and appends it to the div with id
 * "#worfklow-execution-chart".
 */
function generate_workflow_execution_graph(workflow_execution_data) {
    let data = JSON.parse(JSON.stringify(workflow_execution_data));
    // prepare data for d3 stacked layout
    var keys = ['read', 'compute', 'write', 'whole_task'];

    var final_task_end_time = d3.max(data, function(task) {
      return task['whole_task'].end;
    });

    data.forEach(function(task, i) {
        task.start = task['whole_task'].start;
        keys.forEach(function(k) {
            task[(k + '_duration')] = task[k].end - task[k].start;
        });
    });

    // Chart params
    var container = d3.select("#workflow-execution-chart");
    const CONTAINER_WIDTH = container.style("width").slice(0, -2); // returns "XXXXpx" so need to remove "px"
    const CONTAINER_HEIGHT = container.style("height").slice(0, -2);
    const PADDING = 60;

    var read_color    = '#cbb5dd';
    var compute_color = '#f7daad';
    var write_color   = '#abdcf4';
    var colors        = [read_color, compute_color, write_color];

    // Save Reference to the chart div and tooltip div
    var chart = document.getElementById('workflow-execution-chart');

    var tooltip_task                    = d3.select('#workflow-execution-chart-task-tooltip');
    var tooltip_task_id                 = d3.select('#tooltip-task-id');
    var tooltip_task_operation          = d3.select('#tooltip-task-operation');
    var tooltip_task_operation_start    = d3.select('#tooltip-task-operation-start');
    var tooltip_task_operation_end      = d3.select('#tooltip-task-operation-end');
    var tooltip_task_operation_duration = d3.select('#tooltip-task-operation-duration');

    var tooltip_makespan                = d3.select('#workflow-execution-chart-makespan-tooltip');
    var tooltip_makespan_value          = d3.select('#tooltip-makespan-value');

    // Create the svg element
    var svg = d3.select('#workflow-execution-chart')
        .append('svg')
        .attr('width', CONTAINER_WIDTH)
        .attr('height', CONTAINER_HEIGHT);

    // Create scales
    var x_scale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) {
            return d['read_duration'] + d['compute_duration'] + d['write_duration'] + d['start'];
        })])
        .range([PADDING, CONTAINER_WIDTH - PADDING]);

    var task_ids = [];
    data.forEach(function(task) {
        task_ids.push(task['task_id']);
    });

    task_ids.sort(function(lhs, rhs) {
       return parseInt(lhs.slice(4)) - parseInt(rhs.slice(4));
    });

    var y_scale = d3.scaleBand()
        .domain(task_ids)
        .range([CONTAINER_HEIGHT - PADDING, 30])
        .padding(0.1);

    // Stack layout
    var stack = d3.stack().keys([
        'read_duration', 'compute_duration', 'write_duration'
    ]);

    var stack_data = stack(data);

    // Groups
    var groups = svg.selectAll('g')
        .data(stack_data)
        .enter()
        .append('g')
        .attr('class', function(d) {
            return d.key;
        })
        .style('fill', function(d, i) {
            return colors[i];
        });

    // Add the data
    groups.selectAll('rect')
        .data(function(d) {
            return d;
        })
        .enter()
        .append('rect')
        .attr('x', function(d) {
            return x_scale(d[0] + d['data'].start);
        })
        .attr('y', function(d) {
            return y_scale(d['data'].task_id);
        })
        .attr('height', function(d) {
            return y_scale.bandwidth();
        })
        .attr('width', function(d) {
            return x_scale(d[1]) - x_scale(d[0]);
        })
        .on('mouseover', function() {
            tooltip_task.style('display', 'inline');

            d3.select(this)
                .attr('stroke', 'gray')
                .style('stroke-width', '1');
        })
        .on('mousemove', function(d) {
            var offset = getOffset(chart);
            var x = d3.event.pageX - offset.left + 20;
            var y = d3.event.pageY - offset.top - 60; // 20 seems to account for the padding of the chart-block

            tooltip_task.style('left', x + 'px')
                .style('top', y + 'px');

            tooltip_task_id.text('TaskID: ' + d.data.task_id);

            var parent_group = d3.select(this.parentNode).attr('class');

            // TODO: clean this up
            if (parent_group == 'read_duration') {
                tooltip_task_operation.text('Read Input');
                tooltip_task_operation_start.text('Start: ' + toFiveDecimalPlaces(d['data']['read'].start));
                tooltip_task_operation_end.text('End: ' + toFiveDecimalPlaces(d['data']['read'].end));
            } else if (parent_group == 'compute_duration') {
                tooltip_task_operation.text('Computation');
                tooltip_task_operation_start.text('Start: ' + toFiveDecimalPlaces(d['data']['compute'].start));
                tooltip_task_operation_end.text('End: ' + toFiveDecimalPlaces(d['data']['compute'].end));
            } else if (parent_group == 'write_duration') {
                tooltip_task_operation.text('Write Output');
                tooltip_task_operation_start.text('Start: ' + toFiveDecimalPlaces(d['data']['write'].start));
                tooltip_task_operation_end.text('End: ' + toFiveDecimalPlaces(d['data']['write'].end));
            }

            var duration = toFiveDecimalPlaces(d[1] - d[0]);
            tooltip_task_operation_duration.text('Duration: ' + duration + 's');
        })
        .on('mouseout', function(d) {
            tooltip_task.style('display', 'none');

            d3.select(this)
                .attr('stroke', 'none')
        });

    // Create axis
    var x_axis = d3.axisBottom(x_scale);
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform',
            'translate(0,' + (CONTAINER_HEIGHT - PADDING) + ')')
        .call(x_axis);

    var y_axis = d3.axisLeft(y_scale);
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform',
            'translate(' + PADDING + ',0)')
        .call(y_axis);

    // Create x-axis label
    svg.append('text')
        .attr('transform',
            'translate(' + (CONTAINER_WIDTH / 2) + ' ,' + (CONTAINER_HEIGHT - 10) + ')')
        .style('text-anchor', 'middle')
        .attr('font-size', 12+'px')
        .attr('fill', 'gray')
        .text('Time (seconds)');

    // Create y-axis label
    svg.append('text')
        .attr('transform',
            'rotate(-90)')
        .attr('y', -3)
        .attr('x', 0 - (CONTAINER_HEIGHT / 2))
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12+'px')
        .attr('fill', 'gray')
        .text('Workflow Task');

    // add line marking the end of the workflow execution
    var vertical_line = [{'x': x_scale(final_task_end_time), 'y': y_scale.range()[0]},
                         {'x': x_scale(final_task_end_time), 'y': y_scale.range()[1]}];

    var line_func = d3.line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      });

    svg.append('path')
      .attr('d', line_func(vertical_line))
      .attr('stroke', '#5d80ba')
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-dasharray', '4,4')
      .on('mouseover', function() {
          tooltip_makespan.style('display', 'inline');
      })
      .on('mousemove', function(d) {
          var offset = getOffset(chart);
          var x = d3.event.pageX - offset.left + 20;
          var y = d3.event.pageY - offset.top + 10;

          tooltip_makespan.style('left', x + 'px')
              .style('top', y + 'px');

          tooltip_makespan_value.text('Makespan: ' + toFiveDecimalPlaces(final_task_end_time));
      })
      .on('mouseout', function(d) {
          tooltip_makespan.style('display', 'none');
      });

      // add point on bottom marking makespan
      var symbol_location = {'x': x_scale(final_task_end_time), 'y': y_scale.range()[0]};

      var symbolGenerator = d3.symbol()
      	.size(50).type(d3.symbolDiamond);

      svg.append('path')
      	//.attr('transform', 'translate(10,10)')
        .attr('transform', 'translate('+ x_scale(final_task_end_time) +','+ y_scale.range()[0] +')')
      	.attr('d', symbolGenerator())
        .attr('stroke', '#5d80ba')
        .attr('fill', '#d5ddea')
        .on('mouseover', function() {
            tooltip_makespan.style('display', 'inline');
        })
        .on('mousemove', function(d) {
            var offset = getOffset(chart);
            var x = d3.event.pageX - offset.left + 20;
            var y = d3.event.pageY - offset.top + 10;

            tooltip_makespan.style('left', x + 'px')
                .style('top', y + 'px');

            tooltip_makespan_value.text('Makespan: ' + toFiveDecimalPlaces(final_task_end_time));
        })
        .on('mouseout', function(d) {
            tooltip_makespan.style('display', 'none');
        });

}

/**
 * Takes in data generated from
 * "void wrench::SimulationOutput::dumpWorkflowExecutionJSON(wrench::Workflow *workflow,
 *                                                           std::string file_path,
 *                                                           bool generate_host_utilization_layout)"
 * and generates a host utilization chart, and appends it to the div with id
 * "#host-utilization-chart". Note that for this to work, "generate_host_utilization_layout" must
 * be set to true in the simulation so that the JSON contains the right data.
 */
function generate_host_utilization_graph(data, num_cores = 0) {
    var container = d3.select("#host-utilization-chart");
    var chart = document.getElementById('host-utilization-chart');
    const CONTAINER_WIDTH = container.style("width").slice(0, -2); // returns "XXXXpx" so need to remove "px"
    const CONTAINER_HEIGHT = container.style("height").slice(0, -2);
    const PADDING = 50;

    var svg = d3.select("svg");

    if (svg.empty()) {
        svg.remove();
    }

    var tooltip                         = d3.select('#host-utilization-chart-tooltip');
    var tooltip_task_id                 = d3.select('#host-utilization-chart-tooltip-task-id');

    svg = container.append("svg")
        .attr("width", CONTAINER_WIDTH)
        .attr("height", CONTAINER_HEIGHT);

    var x_scale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.whole_task.end;
        })])
        .range([PADDING, CONTAINER_WIDTH - PADDING]);

    var tasks_by_hostname = d3.nest()
        .key(function(d) { return d.execution_host.hostname; })
        .sortKeys(d3.ascending)
        .entries(data);

    var y_hosts = d3.scaleBand()
        .domain(tasks_by_hostname.map(function(d) {
            return d.key;
        }))
        .range([CONTAINER_HEIGHT - PADDING, 10])
        .padding(0.1);

    var y_cores_per_host = d3.map();

    if (num_cores === 0) {
        tasks_by_hostname.forEach(function (d) {
            y_cores_per_host.set(d.key,
                d3.scaleLinear()
                    .domain([0, d.values[0].execution_host.cores])
                    .range([y_hosts(d.key) + y_hosts.bandwidth(), y_hosts(d.key)])
            );
        });
    } else {
        tasks_by_hostname.forEach(function (d) {
            y_cores_per_host.set(d.key,
                d3.scaleLinear()
                    .domain([0, num_cores])
                    .range([y_hosts(d.key) + y_hosts.bandwidth(), y_hosts(d.key)])
            );
        });
    }

    svg.append('g').selectAll('rect')
        .data(y_cores_per_host.keys())
        .enter()
        .append("rect")
        .attr("x", PADDING)
        .attr("y", function(d) {
            return y_hosts(d);
        })
        .attr("width", CONTAINER_WIDTH - PADDING - PADDING)
        .attr("height", y_hosts.bandwidth())
        .attr("opacity", 0.3)
        .attr("fill", "#ffd8f8");


    svg.append('g').selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return x_scale(d.compute.start);
        })
        .attr("y", function(d) {
            var y_scale = y_cores_per_host.get(d.execution_host.hostname);
            return y_scale(d.vertical_position + d.num_cores_allocated);
        })
        .attr("width", function(d) {
            return x_scale(d.compute.end) - x_scale(d.compute.start);
        })
        .attr("height", function(d) {
            var y_scale = y_cores_per_host.get(d.execution_host.hostname);
            return y_scale(0) - y_scale(d.num_cores_allocated);
        })
        .attr("fill", "#f7daad")
        .attr("stroke", "gray")
        .on('mouseover', function() {
            tooltip.style('display', 'inline');

            d3.select(this)
                .attr('fill', '#ffdd7f');
        })
        .on('mousemove', function(d) {
            var offset = getOffset(chart);
            var x = d3.event.pageX - offset.left + 30;
            var y = d3.event.pageY - offset.top + 15;

            tooltip.style('left', x + 'px')
                .style('top', y + 'px');

            tooltip_task_id.text('TaskID: ' + d.task_id);
        })
        .on('mouseout', function(d) {
            tooltip.style('display', 'none');

            d3.select(this)
                .attr('fill', '#f7daad')
        });


    var x_axis = d3.axisBottom(x_scale)
        .ticks(d3.max(data, function(d) {
            return d.end;
        }));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform",
            "translate(0," + (CONTAINER_HEIGHT - PADDING) + ")")
        .call(x_axis);

    var y_axis = d3.axisLeft(y_hosts).tickSize(0);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("stroke-width", "0px")
        .attr("transform",
            "translate(20, 0)")
        .call(y_axis)
        .selectAll("text")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle");

    y_cores_per_host.entries().forEach(function(entry) {
        var axis = d3.axisLeft(entry.value)
            .tickValues(d3.range(0, entry.value.domain()[1] + 1, 1))
            .tickFormat(d3.format(""));;

        svg.append("g")
            .attr("class", "y-axis2")
            .attr("transform",
                "translate(" + PADDING + ",0)")
            .call(axis);
    });

    svg.append("text")
        .attr("transform",
            "translate(" + (CONTAINER_WIDTH / 2) + " ," + (CONTAINER_HEIGHT - 10) + ")")
        .style("text-anchor", "middle")
        .attr('font-size', 12+'px')
        .attr('fill', 'gray')
        .text("Time (seconds)");

    svg.append("text")
        .attr("transform",
            "rotate(-90)")
        .attr("y", -3)
        .attr("x", 0 - (CONTAINER_HEIGHT / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr('font-size', 12+'px')
        .attr('fill', 'gray')
        .text("Host");
}

/**
 * Takes in data generated from
 * "void wrench::SimulationOutput::dumpWorkflowGraphJSON(wrench::Workflow *workflow, std::string file_path);"
 * and generates an SVG which shows the workflow as a DAG. This SVG is appended to the div with
 * id #worfklow-dag-chart.
 */
function generate_workflow_dag(data) {

    var graph = new dagreD3.graphlib
        .Graph()
        .setGraph({});

    data.vertices.forEach(function(vertex) {
        graph.setNode(vertex.id,
            {
                label: vertex.id,
                shape: vertex.type === "file" ? "rect" : "circle",
                style: "stroke: #6c757d; fill: #fff;",
                labelStyle: "font-weight: 200; stroke: #6c757d",
                data: vertex
            });
    });

    data.edges.forEach(function(edge) {
        graph.setEdge(edge.source, edge.target,
            {
                label: "",
                style: " stroke: #6c757d; fill: none; stroke-width: 1px;",
                arrowheadStyle: "fill: #6c757d"
        });
    });

    var container = d3.select("#workflow-dag-chart");
    const CONTAINER_WIDTH = container.style("width").slice(0, -2); // returns "XXXXpx" so need to remove "px"
    const CONTAINER_HEIGHT = container.style("height").slice(0, -2);

    var svg =  container.append("svg")
        .attr("width", CONTAINER_WIDTH)
        .attr("height", CONTAINER_HEIGHT);

    var inner = svg.append("g");

    // Set up zoom support
    var zoom = d3.zoom().on("zoom", function() {
        inner.attr("transform", d3.event.transform);
    });
    svg.call(zoom);

    // Create the renderer
    var render = new dagreD3.render();

    // Run the renderer. This is what draws the final graph.
    render(inner, graph);

    // Center the graph
    var initialScale = 0.5;
    svg.call(zoom.transform,
            d3.zoomIdentity.translate(
                (svg.attr("width") - graph.graph().width * initialScale) / 2,
                (svg.attr("height") - graph.graph().height * initialScale) / 2)
                .scale(initialScale));

    var chart = document.getElementById("workflow-dag-chart");
    var task_tooltip                         = d3.select('#workflow-dag-chart-task-tooltip');
    var task_tooltip_id                 = d3.select('#workflow-dag-chart-task-tooltip-id');
    var task_tooltip_flops                 = d3.select('#workflow-dag-chart-task-tooltip-flops');
    var task_tooltip_memory                 = d3.select('#workflow-dag-chart-task-tooltip-memory');

    var file_tooltip = d3.select("#workflow-dag-chart-file-tooltip");
    var file_tooltip_id = d3.select("#workflow-dag-chart-file-tooltip-id");
    var file_tooltip_size = d3.select("#workflow-dag-chart-file-tooltip-size");

    // In the workflow_graph_json, nodes are labled "vertices", however
    // when dagreD3 creates the DAG graph, vertices are given class names
    // "nodes" and "node", so they must be selected using those names.
    d3.select(".nodes")
        .selectAll(".node")
        .on('mouseover', function() {

            var current_node = d3.select(this);

            var node_id = current_node.select("g")
                .select("g")
                .select("text").select("tspan").text();

            var current_node_data = graph._nodes[node_id].data;

            if (current_node_data.type == "task") {
                task_tooltip.style('display', 'inline');
                current_node.select("circle")
                    .style('fill', "#f7daad");
            } else if (current_node_data.type == "file") {
                file_tooltip.style('display', 'inline');
                current_node.select("rect")
                    .style('fill', "#f7daad");
            }


        })
        .on('mousemove', function() {

            var offset = getOffset(chart);
            var x = d3.event.pageX - offset.left + 30;
            var y = d3.event.pageY - offset.top + 15;

            var current_node = d3.select(this);

            var node_id = current_node.select("g")
                .select("g")
                .select("text").select("tspan").text();

            var current_node_data = graph._nodes[node_id].data;

            if (current_node_data.type == "task") {
                task_tooltip.style('left', x + 'px')
                    .style('top', y + 'px');

                task_tooltip_id.text("TaskID: " + current_node_data.id);
                task_tooltip_flops.text((current_node_data.flops / (1000 * 1000 * 1000)) + " GFlop");
                task_tooltip_memory.text("RAM Requirement: " + (current_node_data.memory / (1000 * 1000)) + " MB");
            } else if (current_node_data.type == "file") {
                file_tooltip.style('left', x + 'px')
                    .style('top', y + 'px');

                file_tooltip_id.text("Filename: " + current_node_data.id);
                file_tooltip_size.text("Size: " + (current_node_data.size / (1000 * 1000)) + " MB");
            }
        })
        .on('mouseout', function() {

            var current_node = d3.select(this);

            var node_id = current_node.select("g")
                .select("g")
                .select("text").select("tspan").text();

            var current_node_data = graph._nodes[node_id].data;

            if (current_node_data.type == "task") {
                task_tooltip.style('display', 'none');
                current_node.select("circle")
                    .style('fill', "none");
            } else if (current_node_data.type == "file") {
                file_tooltip.style('display', 'none');
                current_node.select("rect")
                    .style('fill', "none");
            }
        });
}


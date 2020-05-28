/**
 * Copyright (c) 2019-2020. The eduWRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    au = require("ansi_up"),
    {spawnSync} = require("child_process"),
    fs = require("fs"),
    passport = require("passport"),
    passportSetup = require("./passport-setup")

const PORT = process.env.EDUWRENCH_NODE_PORT || 3000;

cookieSession = require("cookie-session"),
    request = require("request"),
    flash = require("connect-flash");
// keys = require("./keys.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(flash());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.use(cookieSession({
// maxAge: 24 * 60 * 60 * 1000, // a day in milliseconds
// keys: [keys.cookieSession.key]
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// check if authenticated
const authCheck = function (req, res, next) {
    // if (!req.user) {
    //     // if user not already logged in, redirect them to the
    //     // homepage where they can log in
    //     res.redirect("/");
    // } else {
    // the user is logged in so move on to the next middleware
    next();
    // }
}

// WRENCH produces output to the terminal using ansi colors, ansi_up will apply those colors to <span> html elements
var ansi_up = new au.default;

// main route that will show login/logout and available activities
app.get("/", function (req, res) {
    res.render("index", {
        user: req.user,
        messages: req.flash("error")
    });
});

// login through google
app.get("/google", passport.authenticate("google", {
    scope: ["email"]
}));

// callback route for google to redirect to
app.get("/google/redirect", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
}));

// logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

// display networking fundamentals visualization route
app.get("/networking_fundamentals", authCheck, function (req, res) {
    res.render("networking_fundamentals",
        {cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/networking_fundamentals_cyber_infrastructure.svg")});
});

// execute networking fundamentals simulation route
app.post("/run/networking_fundamentals", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/networking_fundamentals/");

    const SIMULATOR = "networking_fundamentals_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;
    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const FILE_SIZES = req.body.file_sizes.replace(/,/g, " ").replace(/ +/g, " ").split(" ");

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = FILE_SIZES.concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stdout.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "networking_fundamentals",
            "simulator": SIMULATOR,
            "file_sizes": FILE_SIZES
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output is sent back to the client (see public/scripts/networking_fundamental.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": "<h5>" + simulation_output.replace(/[\n\r]/g, "<br>\n") + "</h5>"
        });
    }
});


// display workflow execution fundamentals visualization route
app.get("/workflow_execution_fundamentals", authCheck, function (req, res) {
    res.render("workflow_execution_fundamentals",
        {cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/workflow_execution_fundamentals_cyber_infrastructure.svg")});
});

// execute workflow execution fundamentals simulation route
app.post("/run/workflow_execution_fundamentals", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/workflow_execution_fundamentals/");

    const SIMULATOR = "workflow_execution_fundamentals_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;
    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const COMPUTE_SPEED = req.body.compute_speed;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [COMPUTE_SPEED].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "workflow_execution_fundamentals",
            "simulator": SIMULATOR,
            "compute_speed": COMPUTE_SPEED
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/workflow_execution_fundamentals.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        });


    }
});


// display workflow execution data locality visualization route
app.get("/workflow_execution_data_locality", authCheck, function (req, res) {
    res.render("workflow_execution_data_locality",
        {cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/workflow_execution_data_locality_cyber_infrastructure.svg")});
});

// execute activity 1 simulation route
app.post("/run/workflow_execution_data_locality", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/workflow_execution_data_locality/");

    const SIMULATOR = "workflow_execution_data_locality_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;
    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const LINK_BANDWIDTH = req.body.link_bandwidth;
    const STORAGE_OPTION = (req.body.simulator_number == 1 ? "remote" : "local");

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [LINK_BANDWIDTH, STORAGE_OPTION].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "workflow_execution_data_locality",
            "simulator": SIMULATOR,
            "link_bandwidth": LINK_BANDWIDTH
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json"))
        });


    }
});


// display Workflow Execution and Parallelism visualization route
app.get("/workflow_execution_parallelism", authCheck, function (req, res) {
    res.render("workflow_execution_parallelism", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/workflow_execution_parallelism_cyber_infrastructure.svg")
    });
});

// execute Workflow Execution and Parallelism simulation route
app.post("/run/workflow_execution_parallelism", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/workflow_execution_parallelism/");

    const SIMULATOR = "workflow_execution_parallelism_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_NODES = req.body.num_nodes;
    const NUM_CORES_PER_NODE = req.body.num_cores_per_node;
    const NUM_TASKS_TO_JOIN = 20;
    const FILE_SIZE = 2000000000;
    const RAM_REQUIRED = (req.body.ram_required == 1) ? "RAM_REQUIRED" : "RAM_NOT_REQUIRED";

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_NODES, NUM_CORES_PER_NODE, NUM_TASKS_TO_JOIN, FILE_SIZE, RAM_REQUIRED].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "workflow_execution_parallelism",
            "num_nodes": NUM_NODES,
            "num_cores_per_node": NUM_CORES_PER_NODE,
            "num_tasks_to_join": NUM_TASKS_TO_JOIN,
            "file_size": FILE_SIZE,
            "ram_required": RAM_REQUIRED
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});

// display activity multi_core_dependent_tasks visualization route
app.get("/multi_core_dependent_tasks", authCheck, function (req, res) {
    res.render("multi_core_dependent_tasks", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/multi_core_dependent_task.svg")
    });
});

// execute activity multi core dependent tasks simulation route
app.post("/run/multi_core_dependent_tasks", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/multi_core_computing_dependent_tasks/");

    const SIMULATOR = "multi_core_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_CORES = req.body.num_cores;
    const ANALYZE_WORK = req.body.analyze_work;
    const SCHEDULING_SCHEME = req.body.scheduling_scheme;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_CORES, ANALYZE_WORK, SCHEDULING_SCHEME].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "multi_core_dependent_tasks",
            "num_cores": NUM_CORES,
            "analyze_work": ANALYZE_WORK,
            "scheduling_scheme": SCHEDULING_SCHEME
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});



// display activity multi core visualization route
app.get("/multi_core_independent_tasks", authCheck, function (req, res) {
    res.render("multi_core_independent_tasks", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/multi_core_independent_task.svg")
    });
});

// execute activity multi core simulation route
app.post("/run/multi_core_independent_tasks", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/multi_core_computing_independent_tasks/");

    const SIMULATOR = "multi_core_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_CORES = req.body.num_cores;
    const NUM_TASKS = req.body.num_tasks;
    const TASK_GFLOP = req.body.task_gflop;
    const TASK_RAM = req.body.task_ram;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_CORES, NUM_TASKS, TASK_GFLOP, TASK_RAM].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "multi_core_machines",
            "num_cores": NUM_CORES,
            "num_tasks": NUM_TASKS,
            "task_gflop": TASK_GFLOP,
            "task_ram": TASK_RAM
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});





// display activity multi core visualization route
app.get("/multi_core_data_parallelism", authCheck, function (req, res) {
    res.render("multi_core_data_parallelism", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/multi_core_computing_data_parallelism.svg")
    });
});

// execute activity multi core simulation route
app.post("/run/multi_core_data_parallelism", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/multi_core_computing_data_parallelism/");

    const SIMULATOR = "multi_core_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_CORES = req.body.num_cores;
    const OIL_RADIUS = req.body.oil_radius;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_CORES, OIL_RADIUS].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "multi_core_machines",
            "num_cores": NUM_CORES,
            "oil_radius": OIL_RADIUS
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});



// display activity multi core visualization route
app.get("/multi_core_independent_tasks_ram", authCheck, function (req, res) {
    res.render("multi_core_independent_tasks_ram", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/multi_core_independent_task.svg")
    });
});

// execute activity multi core simulation route
app.post("/run/multi_core_independent_tasks_ram", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/multi_core_computing_independent_tasks/");

    const SIMULATOR = "multi_core_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_CORES = req.body.num_cores;
    const NUM_TASKS = req.body.num_tasks;
    const TASK_GFLOP = req.body.task_gflop;
    const TASK_RAM = req.body.task_ram;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_CORES, NUM_TASKS, TASK_GFLOP, TASK_RAM].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "multi_core_machines",
            "num_cores": NUM_CORES,
            "num_tasks": NUM_TASKS,
            "task_gflop": TASK_GFLOP,
            "task_ram": TASK_RAM
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});




// display activity io operations visualization route
app.get("/io_operations", authCheck, function (req, res) {
    res.render("io_operations", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/io_task.svg")
    });
});

// execute activity io operations simulation route
app.post("/run/io_operations", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/io_operations/");

    const SIMULATOR = "io_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_TASKS = req.body.num_tasks;
    const TASK_GFLOP = req.body.task_gflop;
    const TASK_INPUT = req.body.task_input;
    const TASK_OUTPUT = req.body.task_output;
    const IO_OVERLAP = (req.body.io_overlap == 1) ? true : false;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [TASK_INPUT, TASK_OUTPUT, NUM_TASKS, TASK_GFLOP, IO_OVERLAP].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "io_operations",
            "task_input": TASK_INPUT,
            "task_output": TASK_OUTPUT,
            "num_tasks": NUM_TASKS,
            "task_gflop": TASK_GFLOP,
            "io_overlap": IO_OVERLAP
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});

// display activity client server visualization route
app.get("/client_server", authCheck, function (req, res) {
    res.render("client_server", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/client_server.svg")
    });
});

// SIMPLIFIED (NO DISK) CLIENT SERVER SIMULATOR
app.post("/run/client_server", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/client_server/");

    const SIMULATOR = "client_server_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const SERVER_1_LINK_BANDWIDTH = req.body.server_1_link_bandwidth;
    const HOST_SELECT = req.body.host_select;
    const FILE_SIZE = req.body.file_size;

    //Not included in this usage of the simulator
    const SERVER_1_LINK_LATENCY = 10;
    const SERVER_2_LINK_BANDWIDTH = 100;
    const BUFFER_SIZE = 1000000000;
    const DISK_TOGGLE = 0;
    const DISK_SPEED = 50;


    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [SERVER_1_LINK_LATENCY, SERVER_1_LINK_BANDWIDTH, SERVER_2_LINK_BANDWIDTH, BUFFER_SIZE, HOST_SELECT, DISK_TOGGLE, DISK_SPEED, FILE_SIZE].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "client_server",
            "server_1_link_latency": SERVER_1_LINK_LATENCY,
            "server_1_link_bandwidth": SERVER_1_LINK_BANDWIDTH,
            "server_2_link_bandwidth": SERVER_2_LINK_BANDWIDTH,
            "buffer_size": BUFFER_SIZE,
            "host_select": HOST_SELECT,
            "disk_toggle": DISK_TOGGLE,
            "disk_speed": DISK_SPEED,
            "file_size": FILE_SIZE
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});

// display activity client server visualization route
app.get("/client_server_disk", authCheck, function (req, res) {
    res.render("client_server_disk", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/client_server_disk.svg")
    });
});

// FULL CLIENT SERVER (NOT SIMPLIFIED)
app.post("/run/client_server_disk", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/client_server/");

    const SIMULATOR = "client_server_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const SERVER_1_LINK_LATENCY = req.body.server_1_link_latency;
    const SERVER_1_LINK_BANDWIDTH = req.body.server_1_link_bandwidth;
    const SERVER_2_LINK_BANDWIDTH = req.body.server_2_link_bandwidth;
    const BUFFER_SIZE = req.body.buffer_size;
    const HOST_SELECT = req.body.host_select;
    const DISK_TOGGLE = 1;
    const DISK_SPEED = req.body.disk_speed;
    const FILE_SIZE = req.body.file_size;

    //Not included in this usage of the simulator


    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        // "--log=wrench_core_file_transfer_thread.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [SERVER_1_LINK_LATENCY, SERVER_1_LINK_BANDWIDTH, SERVER_2_LINK_BANDWIDTH, BUFFER_SIZE, HOST_SELECT, DISK_TOGGLE, DISK_SPEED, FILE_SIZE].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "client_server_disk",
            "server_1_latency": SERVER_1_LINK_LATENCY,
            "server_1_link": SERVER_1_LINK_BANDWIDTH,
            "server_2_link": SERVER_2_LINK_BANDWIDTH,
            "buffer_size": BUFFER_SIZE,
            "host_select": HOST_SELECT,
            "disk_toggle": DISK_TOGGLE,
            "disk_speed": DISK_SPEED,
            "file_size": FILE_SIZE
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});




// display activity client server visualization route
app.get("/master_worker", authCheck, function (req, res) {
    res.render("master_worker", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/client_server.svg")
    });
});

// execute activity client server simulation route
app.post("/run/master_worker", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/master_worker/");

    const SIMULATOR = "master_worker_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const HOST_SPECS = req.body.host_specs.replace(/,/g, " ").replace(/ +/g, " ").split(" ");
    const TASK_SPECS = req.body.task_specs.replace(/,/g, " ").replace(/ +/g, " ").split(" ");
    const TASK_SCHEDULING_SELECT = req.body.task_scheduling_select;
    const COMPUTE_SCHEDULING_SELECT = req.body.compute_scheduling_select;
    const NUM_INVOCATION = req.body.num_invocation;
    const NUM_WORKERS = req.body.num_workers;
    const MIN_FLOPS = req.body.min_worker_flops;
    const MAX_FLOPS = req.body.max_worker_flops;
    const MIN_BAND = req.body.min_worker_band;
    const MAX_BAND = req.body.max_worker_band;
    const NUM_TASKS = req.body.num_tasks;
    const MIN_INPUT = req.body.min_task_input;
    const MAX_INPUT = req.body.max_task_input;
    const MIN_FLOP = req.body.min_task_flop;
    const MAX_FLOP = req.body.max_task_flop;
    const MIN_OUTPUT = req.body.min_task_output;
    const MAX_OUTPUT = req.body.max_task_output;
    const SEED = req.body.seed;


    const SEED_STATE = ["--seed", SEED];
    const GENERATION = ["--generate", NUM_WORKERS, MIN_FLOPS, MAX_FLOPS, MIN_BAND, MAX_BAND, NUM_TASKS, MIN_INPUT,
        MAX_INPUT, MIN_FLOP, MAX_FLOP, MIN_OUTPUT, MAX_OUTPUT];
    const TASK_SCHED_SELECT = ["--ts", TASK_SCHEDULING_SELECT];
    const COMPUTE_SCHED_SELECT = ["--cs", COMPUTE_SCHEDULING_SELECT];
    const NUM_INV = ["--inv", NUM_INVOCATION];
    let WORKERS = [];
    let iterator = 0;
    while(iterator+1<HOST_SPECS.length) {
        WORKERS.push("--worker");
        WORKERS.push("worker #"+Math.floor(iterator/2));
        WORKERS.push(HOST_SPECS[iterator]);
        WORKERS.push(HOST_SPECS[iterator+1]);
        iterator+=2;
    }

    /**
    iterator = 0;
    while(iterator+2<TASK_SPECS.length) {
        TASK_SPECS[iterator+1] = (parseInt(TASK_SPECS[iterator+1])*1000000000).toString(); //converting to flop from Gflop
        iterator+=3;
    }
    */


    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)

    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:debug",
        // "--log=wrench_core_workunit_executor.thresh:info",
        "--log=simple_wms.thresh:info",
        "--log=simple_wms_scheduler.thresh:info",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const ABBREV_LOGGING = [
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    var SIMULATION_ARGS;
    if (NUM_INVOCATION==1) {
        SIMULATION_ARGS = TASK_SPECS.concat(WORKERS).concat(TASK_SCHED_SELECT).concat(COMPUTE_SCHED_SELECT).concat(NUM_INV).concat(SEED_STATE).concat(LOGGING);
    } else {
        SIMULATION_ARGS = GENERATION.concat(TASK_SCHED_SELECT).concat(COMPUTE_SCHED_SELECT).concat(NUM_INV).concat(SEED_STATE).concat(ABBREV_LOGGING);
    }
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        if (NUM_INVOCATION==1) {
            var simulation_output = simulation_process.stderr.toString();
            console.log(simulation_output);
        } else {
            var simulation_output = simulation_process.stdout.toString();
            console.log(simulation_output);
        }


        let WORKERS_STRIPPED = [];
        for(let i = 0; i<WORKERS.length; i++){
            if(!(WORKERS[i] == "--worker")) {
                WORKERS_STRIPPED.push(WORKERS[i]);
            }
        }


        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        if (NUM_INVOCATION==1) {
            logData({
                "user": USERNAME,
                "email": EMAIL,
                "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
                "activity": "master_worker",
                "tasks": TASK_SPECS,
                "workers": WORKERS_STRIPPED,
                "task_scheduling_selection": TASK_SCHED_SELECT,
                "compute_scheduling_selection": COMPUTE_SCHED_SELECT,
                "num_invocation": NUM_INVOCATION,
                "seed": SEED,
            });
        } else {
            logData({
                "user": USERNAME,
                "email": EMAIL,
                "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
                "activity": "master_worker",
                "task_scheduling_selection": TASK_SCHED_SELECT,
                "compute_scheduling_selection": COMPUTE_SCHED_SELECT,
                "num_invocation": NUM_INVOCATION,
                "seed": SEED,
                "generated": true,
                "num_workers": NUM_WORKERS,
                "min_worker_flops": MIN_FLOPS,
                "max_worker_flops": MAX_FLOPS,
                "min_worker_band": MIN_BAND,
                "max_worker_band": MAX_BAND,
                "num_tasks": NUM_TASKS,
                "min_task_input": MIN_INPUT,
                "max_task_input": MAX_INPUT,
                "min_task_flop": MIN_FLOP,
                "max_task_flop": MAX_FLOP,
                "min_task_output": MIN_OUTPUT,
                "max_task_output": MAX_OUTPUT,
            });
        }

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        if(NUM_INVOCATION == 1) {
            res.json({
                "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
                "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
            });
        } else {
            res.json({
                "simulation_output": "<h5>" + simulation_output.replace(/[\n\r]/g, "<br>\n") + "</h5>"
            });
        }



    }
});


// display activity workflow visualization route
app.get("/workflow_fundamentals", authCheck, function (req, res) {
    res.render("workflow_fundamentals", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/workflow_fundamentals.svg")
    });
});

// execute activity multi core simulation route
app.post("/run/workflow_fundamentals", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/workflow_fundamentals/");

    const SIMULATOR = "workflow_fundamentals_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const USERNAME = req.body.userName;
    const EMAIL = req.body.email;
    const NUM_CORES = req.body.num_cores;
    const DISK_BANDWIDTH = req.body.disk_bandwidth;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%.2d][%h]%e%m%n'"
    ];

    const SIMULATION_ARGS = [NUM_CORES, DISK_BANDWIDTH].concat(LOGGING);
    const RUN_SIMULATION_COMMAND = [EXECUTABLE].concat(SIMULATION_ARGS).join(" ");

    console.log("\nRunning Simulation");
    console.log("===================");
    console.log("Executing command: " + RUN_SIMULATION_COMMAND);
    var simulation_process = spawnSync(EXECUTABLE, SIMULATION_ARGS);

    if (simulation_process.status != 0) {
        console.log("Something went wrong with the simulation. Possibly check arguments.");
        console.log(simulation_process.stderr.toString());
    } else {
        var simulation_output = simulation_process.stderr.toString();
        console.log(simulation_output);

        /**
         * Log the user running this simulation along with the
         * simulation parameters to the data server.
         */
        logData({
            "user": USERNAME,
            "email": EMAIL,
            "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
            "activity": "workflow_fundamentals",
            "num_cores": NUM_CORES,
            "disk_bandwidth": DISK_BANDWIDTH
        });

        /**
         * The simulation output uses ansi colors and we want these colors to show up in the browser as well.
         * Ansi up will take each line, make it into a <span> element, and edit the style so that the text color
         * is whatever the ansi color was. Then the regular expression just adds in <br> elements so that
         * each line of output renders on a separate line in the browser.
         *
         * The simulation output and the workflowtask data are sent back to the client (see public/scripts/activity_1.js)
         */
        var find = "</span>";
        var re = new RegExp(find, "g");

        res.json({
            "simulation_output": ansi_up.ansi_to_html(simulation_output).replace(re, "<br>" + find),
            "task_data": JSON.parse(fs.readFileSync("/tmp/workflow_data.json")),
        });
    }
});

function logData(received_data) {
    let time_now = new Date().toLocaleString("en-US", {timeZone: "Pacific/Honolulu"});
    console.log(time_now + ": received data");
    const DATA_FILE = __dirname.replace("server", "data_server") + "/data_file.json";
    fs.readFile(DATA_FILE, function (err, data) {
        let current_json_data = [];

        // if the file was able to be read, update the json list with new data
        if (!err) {
            current_json_data = JSON.parse(data);
            current_json_data.push(received_data);
        } else {
            // if the file was not able to be read, append the new data to the empty json list
            current_json_data.push(received_data);
        }

        // write the resulting json object to the file (overwriting the old file);
        // cannot simply append since we are writing as json
        fs.writeFile(DATA_FILE, JSON.stringify(current_json_data), function (err) {
            if (err) {
                console.log("app.post('" + received_data.activity +"') callback: there was a problem writing the json file");
                console.log(err);
                return false;
            }
        });
    });
    return true;
}

if (process.env.EDUWRENCH_ENABLE_SSL == "true") {
    const https = require('https');
    const fs = require('fs');
    const options = {
        key: fs.readFileSync('./ssl/' + process.env.EDUWRENCH_SSL_PRIVATE_KEY),
        cert: fs.readFileSync('./ssl/' + process.env.EDUWRENCH_SSL_CERTIFICATE)
    };
    https.createServer(options, app).listen(PORT, function () {
        console.log("Backend server is running on port " + PORT + ' with SSL-enabled mode');
    });
} else {
    app.listen(PORT, function () {
        console.log("Backend server is running on port " + PORT);
    });
}

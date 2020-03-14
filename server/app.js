const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    au = require("ansi_up"),
    {spawnSync} = require("child_process"),
    fs = require("fs"),
    passport = require("passport"),
    passportSetup = require("./passport-setup")
cookieSession = require("cookie-session"),
    request = require("request"),
    flash = require("connect-flash"),
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
    next()
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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "networking_fundamentals",
        //                 "simulator": SIMULATOR,
        //                 "file_sizes": FILE_SIZES
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (!error && response.statusCode == 201) {
        //             console.log("sent POST request to data_server");
        //         } else {
        //             console.log(error);
        //         }
        //     }
        // );

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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "workflow_execution_fundamentals",
        //                 "simulator": SIMULATOR,
        //                 "compute_speed": COMPUTE_SPEED
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (!error && response.statusCode == 201) {
        //             console.log("sent POST request to data_server");
        //         } else {
        //             console.log(error);
        //         }
        //     }
        // );

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

    const SIMULATOR = (req.body.simulator_number == 1 ? "workflow_execution_data_locality_simulator_remote_storage" : "workflow_execution_data_locality_simulator_local_storage");
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;
    const LINK_BANDWIDTH = req.body.link_bandwidth;

    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [LINK_BANDWIDTH].concat(LOGGING);
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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "workflow_execution_data_locality",
        //                 "simulator": SIMULATOR,
        //                 "link_bandwidth": LINK_BANDWIDTH
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (!error && response.statusCode == 201) {
        //             console.log("sent POST request to data_server");
        //         } else {
        //             console.log(error);
        //         }
        //     }
        // );

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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "workflow_execution_parallelism",
        //                 "num_nodes": NUM_NODES,
        //                 "num_cores_per_node": NUM_CORES_PER_NODE,
        //                 "num_tasks_to_join": NUM_TASKS_TO_JOIN,
        //                 "file_size": FILE_SIZE,
        //                 "ram_required": RAM_REQUIRED
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (response.statusCode == 201) {
        //             console.log("made POST request to data_server");
        //         } else {
        //             console.log("error: " + response.statusCode);
        //             console.log(body);
        //         }
        //     }
        // );

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
app.get("/multi_core", authCheck, function (req, res) {
    res.render("multi_core", {
        cyber_infrastructure_svg: fs.readFileSync(__dirname + "/public/img/multi_core_task.svg")
    });
});

// execute activity multi core simulation route
app.post("/run/multi_core", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/multi_core_computing/");

    const SIMULATOR = "multi_core_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

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
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "multi_core_machines",
        //                 "num_cores": NUM_CORES,
        //                 "num_tasks": NUM_TASKS,
        //                 "task_gflop": TASK_GFLOP,
        //                 "task_ram": TASK_RAM
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (response.statusCode == 201) {
        //             console.log("made POST request to data_server");
        //         } else {
        //             console.log("error: " + response.statusCode);
        //             console.log(body);
        //         }
        //     }
        // );

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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "io_operations",
        //                 "task_input": TASK_INPUT,
        //                 "task_output": TASK_OUTPUT,
        //                 "num_tasks": NUM_TASKS,
        //                 "task_gflop": TASK_GFLOP,
        //                 "io_overlap": IO_OVERLAP
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (response.statusCode == 201) {
        //             console.log("made POST request to data_server");
        //         } else {
        //             console.log("error: " + response.statusCode);
        //             console.log(body);
        //         }
        //     }
        // );

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

// execute activity client server simulation route
app.post("/run/client_server", authCheck, function (req, res) {
    const PATH_PREFIX = __dirname.replace("server", "simulators/client_server/");

    const SIMULATOR = "client_server_simulator";
    const EXECUTABLE = PATH_PREFIX + SIMULATOR;

    const SERVER_1_LINK = req.body.server_1_link;
    const SERVER_2_LINK = req.body.server_2_link;
    const CLIENT_DISK = req.body.client_disk;
    const HOST_SELECT = (req.body.host_select == 1) ? 1 : 2;


    // additional WRENCH arguments that filter simulation output (We only want simulation output from the WMS in this activity)
    const LOGGING = [
        "--log=root.thresh:critical",
        "--log=maestro.thresh:critical",
        "--log=wms.thresh:debug",
        "--log=simple_wms.thresh:debug",
        "--log=simple_wms_scheduler.thresh:debug",
        //"--log=file_transfer_thread.thresh:debug",
        "--log='root.fmt:[%d][%h:%t]%e%m%n'"
    ];

    const SIMULATION_ARGS = [SERVER_1_LINK, SERVER_2_LINK, CLIENT_DISK, HOST_SELECT].concat(LOGGING);
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
        // request({
        //         method: "POST",
        //         uri: keys.dataServer.uri,
        //         json: {
        //             "key": keys.dataServer.key,
        //             "data": {
        //                 "user": req.user,
        //                 "time": Math.round(new Date().getTime() / 1000),  // unix timestamp
        //                 "activity": "client_server",
        //                 "task_input": HOST_SELECT,
        //                 "server_1_link": SERVER_1_LINK,
        //                 "server_2_link": SERVER_2_LINK,
        //                 "client_disk": CLIENT_DISK
        //             }
        //         }
        //     },
        //     function (error, response, body) {
        //         if (response.statusCode == 201) {
        //             console.log("made POST request to data_server");
        //         } else {
        //             console.log("error: " + response.statusCode);
        //             console.log(body);
        //         }
        //     }
        // );

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

app.listen(3000, function () {
    console.log("Visualization server is running on port 3000");
});

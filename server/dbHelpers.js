const knex = require("knex");
const config = require("./knexfile");
const db = knex(config.development);

module.exports = {
  add,
};

async function add(sim) {
  /*
  const [id] = await db("executed_sims").insert(sim);
  const [io_id] = await db("io_operations").insert(sim);
  return id;
  */
  return db("executed_sims")
    .insert({ email: sim.email, time: sim.time, activity: "IO" })
    .returning("id")
    .then(function (response) {
      return db("io_operations").insert({
        id: response[0],
        num_tasks: sim.num_tasks,
        task_gflop: sim.task_gflop,
        task_input: sim.task_input,
        task_output: sim.task_output,
        io_overlap: sim.io_overlap,
      });
    });
}

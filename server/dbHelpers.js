const knex = require("knex");
const config = require("./knexfile");
const db = knex(config.development);

module.exports = {
  add,
};

async function add(sim) {
  const [id] = await db("executed_sims").insert(sim);
  return id;
}

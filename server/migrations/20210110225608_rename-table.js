exports.up = function (knex) {
  return knex.schema.renameTable("simulations", "executedSims");
};

exports.down = function (knex) {};

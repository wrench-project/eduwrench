exports.up = function (knex) {
  return knex.schema.createTable("simulations", (tbl) => {
    tbl.increments("id");
    tbl.text("email").notNullable();
    tbl.integer("time");
    tbl.text("activity");
  });
};

exports.down = function (knex) {};

exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments("id");
    tbl.text("email").notNullable();
    tbl.integer("time").notNullable();
    tbl.text("activity").notNullable();
  });
};

exports.down = function (knex) {};

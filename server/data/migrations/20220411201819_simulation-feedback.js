
exports.up = function(knex) {
    return knex.schema.createTable("simulation_feedback", tbl => {
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        tbl.text("sim_id").notNullable()
        tbl.integer("time").notNullable()
        tbl.text("rating").notNullable()
        tbl.text("feedback").notNullable()
        tbl.boolean("completed").notNullable()

    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("simulation_feedback")
};

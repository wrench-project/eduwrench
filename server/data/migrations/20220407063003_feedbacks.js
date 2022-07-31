
exports.up = function(knex) {
    return knex.schema.createTable("feedbacks", tbl => {
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        tbl.text("tabkey").notNullable()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.text("useful").notNullable()
        tbl.text("quality").notNullable()
        tbl.text("comments").notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("feedbacks")
};

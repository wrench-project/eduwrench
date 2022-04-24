
exports.up = function(knex) {
    return knex.schema.createTable("feedbacks", tbl => {
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        tbl.text("feedback_key").notNullable()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.text("useful")
        tbl.text("quality")
        tbl.text("comments")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("feedbacks")
};

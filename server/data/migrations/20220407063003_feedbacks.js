
exports.up = function(knex) {
    return knex.schema.createTable("feedbacks", tbl => {
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        // tbl.text("user_name").notNullable()
        // tbl.text("email").notNullable()
        tbl.text("feedback_key").notNullable()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.string("useful")
        tbl.string("quality")
        tbl.text("comments")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("feedbacks")
};

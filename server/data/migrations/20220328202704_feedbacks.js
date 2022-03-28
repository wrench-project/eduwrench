
exports.up = function(knex) {
    return knex.schema.createTable("feedbacks", tbl => {
        tbl.text("feedback_key").notNullable().primary()
        tbl.integer("time").notNullable()
        tbl.boolean("feedbackMsg")
        tbl.text("feedbacks")
        tbl.integer("useful")
        tbl.integer("quality")
        tbl.text("comments")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("feedbacks")
};


exports.up = function(knex) {
    return knex.schema.createTable("feedbacks", tbl => {
        tbl.text("user_name").notNullable()
        tbl.text("email").notNullable()
        tbl.text("feedback_key").notNullable().primary()
        tbl.integer("time").notNullable()
        tbl.text("useful")
        tbl.text("quality")
        tbl.text("comments")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("feedbacks")
};

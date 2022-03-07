
exports.up = function(knex) {
    return knex.schema.createTable("practice_questions", tbl => {
        tbl.text("question_key").notNullable().primary()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.integer("attempts")
        tbl.text("previous_answer")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("practice_questions")
};

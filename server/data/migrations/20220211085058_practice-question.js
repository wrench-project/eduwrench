
exports.up = function(knex) {
    return knex.schema.createTable("practice_questions", tbl => {
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        tbl.text("module").notNullable()
        tbl.text("question_key").notNullable()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.text("type").notNullable()
        tbl.integer("attempts")
        tbl.text("previous_answer")
        tbl.boolean("hint")
        tbl.boolean("giveup")
        tbl.boolean("revealed")
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("practice_questions")
};

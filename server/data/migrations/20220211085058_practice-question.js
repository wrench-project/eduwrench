
exports.up = function(knex) {
    return knex.schema.createTable("practice_questions", tbl => {
        tbl.text("question_key").notNullable()
        tbl.integer("time").notNullable()
        tbl.boolean("completed").notNullable()
        tbl.integer("attempts").notNullable()
        tbl.boolean("hint").notNullable()
        tbl.boolean("giveup").notNullable()
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists("practice_questions")
};

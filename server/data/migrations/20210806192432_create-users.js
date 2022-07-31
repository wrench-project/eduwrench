/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

exports.up = function (knex) {
    return knex.schema.createTable("users", tbl => {
        tbl.increments("id")
        tbl.text("email").unique().notNullable()
        tbl.text("name")
        // tbl.text("name").notNullable()
    })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("users")
}

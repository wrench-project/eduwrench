/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

exports.up = function (knex) {
    return knex.schema.createTable("simulation_runs", tbl => {
        tbl.increments("id")
        tbl.integer("user_id").references("id").inTable("users").onDelete("CASCADE")
        tbl.integer("time").notNullable()
        tbl.text("activity").notNullable()
        tbl.text("params").notNullable()
    })
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("simulation_runs")
}

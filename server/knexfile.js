/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

module.exports = {
    development: {
        client: "sqlite3",
        connection: {
            filename: "../db/eduwrench-server.db"
        },
        useNullAsDefault: true,
        migrations: {
            directory: "./data/migrations"
        }
    }
}

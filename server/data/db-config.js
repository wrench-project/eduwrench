/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

const knex = require("knex")
const config = require("../knexfile")
const db = knex(config.development)

const registerUser = (email, name) => db.transaction(async trx => {
    const user = await trx("users")
        .where({email: email})
        .first()
    if (user) {
        return user.id
    }
    const id = await trx("users").insert({
        email: email,
        name: name
    })
    return id[0]
})

const addSimulationRun = (userID, time, activity, params) => db.transaction(async trx => {
    const simID = await trx("simulation_runs").insert({
        "user_id": userID,
        time: time,
        activity: activity,
        params: JSON.stringify(params)
    })
    return simID[0]
})

const getUsageStatistics = () => db.transaction(async trx => {
    const usage = await trx("simulation_runs").select('time', 'activity')
    return usage
})

const updatePracticeQuestion = (question_key, time, completed, attempts) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key})
        .first()
    if (!question) {
        const questionID = await trx("practice_questions").insert({
            question_key: question_key,
            time: time,
            completed: completed,
            attempts: attempts
        })
        console.log('creating practice questions')
        return questionID[0]
    } else {
        console.log("updating practice quesitons")
        const question = await trx("practice_questions").update({
                question_key: question_key,
                time: time,
                completed: completed,
                attempts:attempts
            })
        return question
    }
})

const getPracticeQuestion = (question_key) => db.transaction(async trx => {
    const questionInfo = await trx("practice_questions")
        .where({question_key:question_key})
        .select('attempts', 'completed')
    return questionInfo[0]
})

const updateHintGU = (hint, giveup) => db.transaction (async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key})
        .first()
    if (!question) {
        const questionID = await trx("practice_question").insert({
            question_key: question_key,
            hint: hint,
            giveUp: giveup
        })
        return questionID[0]
    } else {
        const question = await trx("practice_questions").update({
            question_key: question_key,
            hint: hint,
            giveup: giveup
        })
    return question
    } 
})

module.exports = {
    registerUser,
    addSimulationRun,
    getUsageStatistics,
    updatePracticeQuestion,
    getPracticeQuestion,
    updateHintGU,
}

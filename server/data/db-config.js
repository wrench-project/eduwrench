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

/*  */
const updatePracticeQuestion = (question_key, time, answer, correctAnswer, type) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key})
        .first()
    const correct = (type === 'numeric') ? parseInt(answer) >= correctAnswer[0] && parseInt(answer) <= correctAnswer[1] : answer === correctAnswer
    console.log(answer, correctAnswer)
    let completed = (question) ? await trx("practice_questions")
        .where({question_key:question_key})
        .select('completed')
        .first()
        .then((completed) => completed.completed)
    : false
    if (!question) {
        console.log('creating practice questions')
        const questionID = await trx("practice_questions").insert({
            question_key: question_key,
            time: time,
            completed: correct,
            attempts: 1,
            previous_answer: answer
        })
        return questionID[0]
    }
    if (!completed) {
        console.log("updating practice quesitons")
        const attempts = await trx("practice_questions")
            .where({question_key: question_key})
            .select('attempts')
            .first()
            .then((attempts) => attempts.attempts);
        const question = await trx("practice_questions").where({question_key:question_key}).update({
                question_key: question_key,
                time: time,
                completed: correct,
                attempts:attempts + 1,
                previous_answer: answer
            })
        return question
    } else {
        console.log("Answer is correct " + question_key + " is disabled now")
        return question
    }
})

const setUpdateGiveUp = (question_key, time, button, answer) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key})
        .first()
    const questionInfo = {
        question_key: question_key,
        time: time,
        completed: false,
        previous_answer: '',
    };
    (button === 'hint') ? (questionInfo['hint'] = true)
        : (questionInfo['giveup'] = true,
            questionInfo["completed"] = true,
            questionInfo["previous_answer"] = answer)
    if (!question) {
        console.log('creating practice questions')
        const questionID = await trx("practice_questions").insert(questionInfo)
        return questionID[0]
    } else {
        const question = await trx('practice_questions').where({question_key:question_key}).update(questionInfo)
        return question
    }
})

const getPracticeQuestion = (question_key) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key})
        .first()
    const questionData = (question) ? await trx("practice_questions")
            .where({question_key:question_key})
            .select('completed', 'previous_answer', 'giveup')
            .first()
        : false
    return questionData
})

const updateFeedback = (feedback_key, time, useful, quality, comments) => db.transaction(async trx => {
    const feedback = await trx("feedbacks")
        .where({feedback_key:feedback_key})
        .select('feedbacks')
        .first()
    if (!feedback) {
        console.log('creating feedbacks')
        const feedbackID = await trx("feedbacks").insert({
            feedback_key: feedback_key,
            time: time,
            useful: useful,
            quality: quality,
            comments: comments,
        })
        return feedbackID[0]
    }
})

const getFeedback = (feedback_key) => db.transaction(async trx => {
    const feedback = await trx("feedbacks")
        .where({feedback_key:feedback_key})
        .select('feedbacks')
        .first()
    const feedbackData = (feedback) ? await trx("feedbacks")
        .where({feedback_key:feedback_key})
        //.select('feedbackMsg')
        .first()
    : false
    return feedbackData
})

module.exports = {
    registerUser,
    addSimulationRun,
    getUsageStatistics,
    updatePracticeQuestion,
    getPracticeQuestion,
    setUpdateGiveUp,
    updateFeedback,
    getFeedback
}

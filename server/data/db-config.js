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
const updatePracticeQuestion = (userID, question_key, time, answer, correctAnswer, type, module) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key, user_id: userID})
        .first()
    const correct = (type === 'numeric') ? parseInt(answer) >= correctAnswer[0] && parseInt(answer) <= correctAnswer[1] : answer === correctAnswer
    let completed = (question) ? await trx("practice_questions")
        .where({question_key:question_key})
        .select('completed')
        .first()
        .then((completed) => completed.completed)
    : false
    if (!question) {
        console.log('creating practice questions')
        const questionID = await trx("practice_questions").insert({
            user_id: userID,
            question_key: question_key,
            time: time,
            completed: correct,
            attempts: 1,
            previous_answer: answer,
            module: module
        })
        return questionID[0]
    }
    if (!completed) {
        console.log("updating practice quesitons")
        const attempts = await trx("practice_questions")
            .where({question_key: question_key, user_id: userID})
            .select('attempts')
            .first()
            .then((attempts) => attempts.attempts);
        const question = await trx("practice_questions").where({question_key:question_key, user_id: userID}).update({
            user_id: userID,
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

const setUpdateGiveUp = (userID, question_key, time, button, answer) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key, user_id: userID})
        .first()
    const questionInfo = {
        user_id: userID,
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

const getPracticeQuestion = (userID, question_key) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key, user_id: userID})
        .first()
    const questionData = (question) ? await trx("practice_questions")
            .where({question_key:question_key, user_id: userID})
            .select('completed', 'previous_answer', 'giveup')
            .first()
        : false
    return questionData
})

const logSimulationFeedback = (userID, time, simID, rating, feedback) => db.transaction(async trx => {
        const simFeedbackID = await trx("simulation_feedback").insert({
            user_id: userID,
            sim_id: simID,
            time: time,
            rating: rating,
            feedback: feedback,
            completed: true
        })
        return simFeedbackID
})

const getSimulationFeedback = (userID, simID) => db.transaction(async trx => {
    const feedback = await trx("simulation_feedback")
        .where({sim_id: simID, user_id: userID})
        .first()
    const feedbackData = (feedback) ? await trx("simulation_feedback")
            .where({sim_id: simID, user_id: userID})
            .select('completed')
            .first()
        : false
})

const updateFeedback = (userID, feedback_key, time, useful, quality, comments, module) => db.transaction(async trx => {
    const feedback = await trx("feedbacks")
        .where({feedback_key:feedback_key, user_id: userID})
        .first()
    const feedbackInfo = {
        user_id: userID,
        feedback_key: feedback_key,
        time: time,
        completed: true,
        useful: useful,
        quality: quality,
        comments: comments,
        module: module
    };
    if (!feedback) {
        console.log('creating feedbacks')
        const feedbackID = await trx("feedbacks").insert(feedbackInfo)
        return feedbackID[0]
    }
})

const getFeedback = (userID, feedback_key) => db.transaction(async trx => {
    const feedback = await trx("feedbacks")
        .where({user_id: userID, feedback_key:feedback_key})
        .first()
    const feedbackData = (feedback) ? await trx("feedbacks")
        .where({user_id: userID, feedback_key:feedback_key})
        .select('completed')
        .first()
    : false
    return feedbackData
})

const getUserData = (userID) => db.transaction(async trx => {
    const questionData = await trx("practice_questions")
        .where({user_id: userID})
        .select('question_key', 'time', 'completed')
    const feedbackData = await trx("feedbacks")
        .where({user_id: userID})
        .select('feedback_key', 'time', 'completed')
    const userData = {
        questionData: questionData,
        feedbackData: feedbackData
    }
    return userData
})

module.exports = {
    registerUser,
    addSimulationRun,
    getUsageStatistics,
    updatePracticeQuestion,
    getPracticeQuestion,
    setUpdateGiveUp,
    logSimulationFeedback,
    getSimulationFeedback,
    updateFeedback,
    getFeedback,
    getUserData
}

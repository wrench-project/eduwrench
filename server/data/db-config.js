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
const updatePracticeQuestionSubmit = (userID, question_key, time, answer, correctAnswer, module) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key, user_id: userID})
        .first()
    const correct = (question.type === 'numeric') ? parseInt(answer) >= correctAnswer[0] && parseInt(answer) <= correctAnswer[1] : answer === correctAnswer
    let completed = (question) ? await trx("practice_questions")
            .where({question_key:question_key})
            .select('completed')
            .first()
            .then((completed) => completed.completed)
        : false
    if (!completed) {
        const attempts = await trx("practice_questions")
            .where({question_key: question_key, user_id: userID})
            .select('attempts')
            .first()
            .then((attempts) => attempts.attempts);
        const question = await trx("practice_questions").where({question_key:question_key, user_id: userID}).update(
            {
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

const updatePracticeQuestionGiveUp = (userID, question_key, time, module) => db.transaction(async trx => {
    console.log("IN updatePracticeQuestionGiveUp");
    // const question = await trx("practice_questions")
    //     .where({question_key:question_key, user_id: userID})
    //     .first()
    // const questionInfo = {
    //     // user_id: userID,
    //     // question_key: question_key,
    //     time: time,
    //     completed: false,
    //     giveup: true,
    //     // previous_answer: '',
    //     // module: module
    // };

    // console.log(questionInfo)
    const question = await trx('practice_questions').where({question_key:question_key}).update(
        {time: time, completed: false, giveup: true}
    )
    return question
})

const updatePracticeQuestionHint = (userID, question_key, time, module) => db.transaction(async trx => {
    console.log("IN updatePracticeQuestionHint():");
    // const question = await trx("practice_questions")
    //     .where({question_key:question_key, user_id: userID})
    //     .first()
    // const questionInfo = {
    //     user_id: userID,
    //     question_key: question_key,
    //     time: time,
    //     completed: false,
    //     hint: true,
    //     previous_answer: '',
    //     module: module
    // };
    // (button === 'hint') ? (questionInfo['hint'] = true)
    //     : (questionInfo['giveup'] = true,
    //         questionInfo["completed"] = true,
    //         questionInfo["previous_answer"] = answer)
    //     console.log(questionInfo)
        const question = await trx('practice_questions').where({question_key:question_key}).update(
            {hint: true})
        return question
})

const updatePracticeQuestionReveal = (userID, question_key, time, module) => db.transaction(async trx => {
    console.log("IN updatePracticeQuestionReveal():");
    // const questionUpdate = {
    // user_id: userID,
    // question_key: question_key,
    // time: time,
    // module:
    // completed: false,
    // revealed: true,
    // previous_answer: '',
    // };
    // console.log(questionInfo)
    const question = await trx('practice_questions').where({question_key:question_key, user_id: userID}).
    update({revealed: true})
    return question
})

const loadPracticeQuestion = (userID, question_key, module, type) => db.transaction(async trx => {
    const question = await trx("practice_questions")
        .where({question_key:question_key, user_id: userID})
        .first()
    if (question) {
        // Retrieve question data
        const questionData = await trx("practice_questions")
            .where({question_key: question_key, user_id: userID})
            .select('completed', 'previous_answer', 'giveup', 'revealed')
            .first()
        return questionData
    } else {
        // Create blank question data since DB doesn't have the question
        console.log("Creating a blank " + question_key + " question for user " + userID)
        const blankQuestion = {
            user_id: userID,
            question_key: question_key,
            module: module,
            type: type,
            time: 0,
            completed: false,
            revealed: false,
            giveup: false,
            previous_answer: '',
        };
        const questionData = await trx("practice_questions").insert(blankQuestion)
        return questionData
    }
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
    console.log("in getSimulationFeedback")
    const feedback = await trx("simulation_feedback")
        .where({sim_id: simID, user_id: userID})
        .first()
    const feedbackData = (feedback) ? await trx("simulation_feedback")
            .where({sim_id: simID, user_id: userID})
            .select('completed')
            .first()
        : false
    return feedbackData
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

const getGlobalStatistics = () => db.transaction(async trx => {
    const globalQuestion = await trx("practice_questions")
        .select('time', 'completed', 'attempts', 'giveup')
    const globalFeedback = await trx("feedbacks")
        .select('time', 'completed', 'useful', 'quality')
    const globalSimFeedback = await trx("simulation_feedback")
        .select('time', 'rating')
    const global = {
        globalQuestion: globalQuestion,
        globalFeedback: globalFeedback,
        globalSimFeedback: globalSimFeedback
    }
    return global
})

const getUserData = (userID) => db.transaction(async trx => {
    const questionData = await trx("practice_questions")
        .where({user_id: userID})
        .select('question_key', 'time', 'completed', 'module')
    const feedbackData = await trx("feedbacks")
        .where({user_id: userID})
        .select('feedback_key', 'time', 'completed', 'module')
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
    loadPracticeQuestion,
    updatePracticeQuestionSubmit,
    updatePracticeQuestionGiveUp,
    updatePracticeQuestionHint,
    updatePracticeQuestionReveal,
    logSimulationFeedback,
    getSimulationFeedback,
    updateFeedback,
    getFeedback,
    getGlobalStatistics,
    getUserData
}

/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, {useEffect, useState} from "react"
import Layout from "../components/layout";
import PageHeader from "../components/page_header";
import {Segment, Header, Loader, Button} from "semantic-ui-react";
import PracticeQuestionInfo from "../components/stats/practice_question_info";
import SimulationInfo from "../components/stats/simulation_info";
import FeedbackInfo from "../components/stats/feedback_info";
import axios from "axios";
import {useStaticQuery, graphql} from "gatsby";

const Stats = () => {
    const [userData, setUserData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const data = useStaticQuery(graphql`
    query MyQuery {
        practicequestionYaml {
            PracticeQuestions {
                moduleNumber
                module
                question
            }
        }
    }
    `)

    let modulePracticeQuestions = data["practicequestionYaml"]["PracticeQuestions"]

    const resetAllPracticeQuestions = ()  => {
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName")
        axios
            .post('http://localhost:3000/get/resetpracticequestions', {
                userName: userName,
                email: userEmail,
            })
            .then((response) => {
            })
    }

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName")
        axios
            .post('http://localhost:3000/get/userdata', {
                userName: userName,
                email: userEmail,
            })
            .then((response) => {
                console.log("USER DATA:")
                console.log(response.data)
                setUserData(response.data)

                const questionData = response.data.questionData


                for (let i = 0; i < modulePracticeQuestions.length; i++) {
                    modulePracticeQuestions[i].doneQuestions = []
                    for (const question of questionData) {
                        if (question.module === modulePracticeQuestions[i].moduleNumber) {
                            if (question.completed || question.giveup || question.revealed) {
                                modulePracticeQuestions[i].doneQuestions.push(question)
                            }
                        }
                    }
                }

                setLoading(false)
            })
    }, [])

    if (isLoading) {
        return <Loader>Loading</Loader>
    }

    return (
        <Layout>
            <PageHeader title="Personal Statistics about EduWRENCH Usage/Completion"/>

            <Segment>
                This page displays some information regarding your usage of the EduWRENCH pedagogic modules to date.
            </Segment>

            <Segment>
                <Header as="h3" block>
                    <a id="modules">Practice Questions</a>
                </Header>
            </Segment>

            <p>
                This section indicates your level of coverage of the practice questions for each module.
            </p>

            {modulePracticeQuestions.map((module, index) => <PracticeQuestionInfo userData={userData} key={index} module={module} listIndex={index}/>)}

            <div>
                <br/>
                {<Button onClick={resetAllPracticeQuestions} color="red" size="small" content="Click to reset coverage to zero"/>}
            </div>

            <Segment>
                <Header as="h3" block>
                    <a id="simulations">Simulations</a>
                </Header>
            </Segment>
            <p>
                This section shows some data regarding your usage of the simulation-driven pedagogic activities.
            </p>

            <Segment>
                <SimulationInfo simulationData={userData.simulationData}/>
            </Segment>

            <Segment>
                <Header as="h3" block>
                    <a id="feedback">Provided Feedback</a>
                </Header>
            </Segment>

            <p>
                This section shows the <strong>module tabsyou have visited</strong> for which you have or have not provided feedback
                (by answering a couple of questions at the bottom of the tab).<br/>

                <Segment>
                    <FeedbackInfo feedbackData={userData.feedbackData}/>
                </Segment>
            </p>
            <br/>
        </Layout>
    )
}

export default Stats
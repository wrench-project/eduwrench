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
import { Segment, Header, Loader}  from "semantic-ui-react";
import ModuleInfo from "../components/stats/module_info";
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

    let practiceQuestions = data["practicequestionYaml"]["PracticeQuestions"]

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName")
        axios
            .post('http://localhost:3000/get/userdata', {
                userName: userName,
                email: userEmail,
            })
            .then((response) => {
                setUserData(response.data)
                const feedbackData = response.data.feedbackData
                const questionData = response.data.questionData
                for (let i = 0; i < practiceQuestions.length; i++) {
                    if (feedbackData[i] && feedbackData[i].module === practiceQuestions[i].moduleNumber) {
                        practiceQuestions[i].feedback = feedbackData[i]
                    } else {
                        practiceQuestions[i].feedback = {
                            completed: false
                        }
                    }
                }
                for (let i = 0; i < practiceQuestions.length; i++) {
                    practiceQuestions[i].feedback = []
                    for (const feedback of feedbackData) {
                        if (feedback.module === practiceQuestions[i].moduleNumber) {
                            practiceQuestions[i].feedback.push(feedback)
                        }
                    }
                }
                for (let i = 0; i < practiceQuestions.length; i++) {
                    practiceQuestions[i].completedQuestions = []
                    for (const question of questionData) {
                        if (question.module === practiceQuestions[i].moduleNumber && question.completed) {
                            practiceQuestions[i].completedQuestions.push(question)
                        } else if (!practiceQuestions[i].completedQuestions) {
                            practiceQuestions[i].completedQuestions = []
                        }
                    }
                }
                console.log(practiceQuestions)
                setLoading(false)
            })
    }, [])

    if (isLoading) {
        return <Loader>Loading</Loader>
    }

    return (
    <Layout>
        <PageHeader title="Personal Statistics"/>
        <Segment>
            <Header as="h3" block>
                <a id="modules">Modules</a>
            </Header>

        </Segment>
        {practiceQuestions.map((module, index) => <ModuleInfo userData={userData} key={index} module={module} listIndex={index}/>)}
        <Segment>
            <Header as="h3" block>
                <a id="simulations">Simulations</a>
            </Header>
        </Segment>
    </Layout>
    )
}

export default Stats
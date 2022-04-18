/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, {useEffect} from "react"
import Layout from "../components/layout";
import PageHeader from "../components/page_header";
import { Segment, Header}  from "semantic-ui-react";
import ModuleInfo from "../components/stats/module_info";
import axios from "axios";
import {useStaticQuery, graphql} from "gatsby";

const Stats = () => {
    const moduleList = [
        {
            name: 'test module 1',
            feedback: true,
            feedbackTime: '2:57pm',
            questions: [
                {
                    key: 'A.1p1.1',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.2',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.3',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.1',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.2',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
            ]
        },
        {
            name: 'test module 2',
            feedback: false,
            feedbackTime: null,
            questions: [
                {
                    key: 'A.1p1.1',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.2',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.3',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.1',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.2',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
            ]
        },
        {
            name: 'test module 3',
            feedback: false,
            feedbackTime: null,
            questions: [
                {
                    key: 'A.1p1.1',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.2',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.3',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.1',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.2',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
            ]
        },
        {
            name: 'test module 4',
            feedback: true,
            feedbackTime: '2:57pm',
            questions: [
                {
                    key: 'A.1p1.1',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.2',
                    completed: true,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p1.3',
                    completed: true,
                    gaveup: true,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.1',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
                {
                    key: 'A.1p2.2',
                    completed: false,
                    gaveup: false,
                    time:'12:00pm',
                },
            ]
        }
        ]

    return (
    <Layout>
        <PageHeader title="Personal Statistics"/>
        <Segment>
            <Header as="h3" block>
                <a id="modules">Modules</a>
            </Header>
            {moduleList.map((module, index) => <ModuleInfo key={index} module={module} listIndex={index}/>)}
        </Segment>

        <Segment>
            <Header as="h3" block>
                <a id="simulations">Simulations</a>
            </Header>
        </Segment>
    </Layout>
    )
}

export default Stats
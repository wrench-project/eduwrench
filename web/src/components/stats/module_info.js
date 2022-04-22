import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";
import InfoRow from "./info_row";


const ModuleInfo = ({userData, module, listIndex}) => {
    // {question_key, time, completed}
    const questionData = userData.questionData
    // ["A.1p1.1", "A.1p1.2", "A.1p1.3" ...]
    const questionArr = module.question
    const feedbackTime = new Date(module.feedback.time * 1000).toLocaleString()

    const augmentQuestionData = () => {
        for (let i = 0; i < questionArr.length; i++) {
            for (const question in questionData) {
                if (questionData[question].question_key === questionArr[i]) {
                    questionArr[i] = questionData[question]
                }
            }
        }
        return questionArr
    }


    const checkComplete = () => {
        return (questionData.length === questionArr.length) && module.feedback.completed
    }

    const [activeIndex, setActiveIndex] = useState(-1)

    const handleClick = (e, titleProp) => {
        const { index } = titleProp
        const newIndex = activeIndex === index ? -1 : index
        setActiveIndex(newIndex)
    }

    return(
        <Accordion styled fluid>
            <Accordion.Title
                active={activeIndex === listIndex}
                index={listIndex}
                onClick={handleClick}
            >
                <Grid columns={3}>
                    <Grid.Column width={4}>
                        <Icon name='dropdown'/>
                        {module.module}
                        {checkComplete(module.questions, userData.questionData, module.feedback) ?
                            <Popup
                                content='You have completed this module!'
                                trigger={<Icon color='green' name='check'/>}
                            />
                            : <Popup
                                content='You have not completed this module'
                                trigger={<Icon color='red' name='x'/>}
                            />}
                    </Grid.Column>
                    <Grid.Column width={1}>
                        Questions: {questionData.length} / {questionArr.length}
                    </Grid.Column>
                    <Grid.Column width={1}>
                        Feedback:  {module.feedback.completed ?
                            <Popup
                                content='Thanks for your feedback'
                                trigger={<Icon color='green' name='comment'/>}
                                />
                            : <Popup
                            content='Please give feedback!'
                            trigger={<Icon color='red' name='comment'/>}
                            />}
                        {module.feedback.completed ? feedbackTime : ''}
                    </Grid.Column>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === listIndex}>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Practice Question</Table.HeaderCell>
                                <Table.HeaderCell>Completed</Table.HeaderCell>
                                <Table.HeaderCell>Completed Time</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {augmentQuestionData().map((question) => <InfoRow key={question.key} question={question}/> )}
                        </Table.Body>
                    </Table>
            </Accordion.Content>
            <Divider fitted/>
        </Accordion>
        )
}

export default ModuleInfo
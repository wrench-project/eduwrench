import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";
import InfoRow from "./info_row";


const ModuleInfo = ({module, listIndex}) => {
    const completedQuestions = module.completedQuestions
    const numberCompleted = module.completedQuestions.length
    // ["A.1p1.1", "A.1p1.2", "A.1p1.3" ...]
    const questionArr = module.question
    const numberFeedback = module.feedback.length

    const augmentQuestionData = () => {
        for (let i = 0; i < questionArr.length; i++) {
            for (const question in completedQuestions) {
                if (completedQuestions[question].question_key === questionArr[i]) {
                    questionArr[i] = completedQuestions[question]
                }
            }
        }
        return questionArr
    }

     const checkComplete = () => {
        return (numberCompleted === questionArr.length) && numberFeedback > 0
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
                        {checkComplete() ?
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
                        Questions: {numberCompleted} / {questionArr.length}
                    </Grid.Column>
                    <Grid.Column width={1}>
                        {numberFeedback} Feedback
                        {numberFeedback > 0 ?
                            <Popup
                                content='Thanks for your feedback'
                                trigger={<Icon style={{paddingLeft: '5px'}} color='green' name='comment'/>}
                                />
                            : <Popup
                            content='Please give feedback!'
                            trigger={<Icon style={{paddingLeft: '5px'}} color='red' name='comment'/>}
                            />}
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
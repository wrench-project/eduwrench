import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";
import PracticeQuestionInfoRow from "./practice_question_info_row";


const PracticeQuestionInfo = ({module, listIndex}) => {
    // ["A.1p1.1", "A.1p1.2", "A.1p1.3" ...]
    const questionArr = module.question
    const numberDone = module.doneQuestions.length
    const numberToDo = questionArr.length - numberDone

    const augmentQuestionData = () => {
        for (let i = 0; i < questionArr.length; i++) {
            for (const question in module.doneQuestions) {
                if (module.doneQuestions[question].question_key === questionArr[i]) {
                    questionArr[i] = module.doneQuestions[question]
                }
            }
        }
        return questionArr
    }

    const checkComplete = () => {
        return (numberToDo === 0)
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
                <Grid columns={2}>
                    <Grid.Column width={4}>
                        <Icon name='dropdown'/>
                        {module.module}
                    </Grid.Column>
                    <Grid.Column width={1}>
                        {checkComplete() ?
                            <Popup
                                content='You have completed all practice questions in this module!'
                                trigger={<div><Icon color='green' name='check'/>Todo: {numberToDo} / {questionArr.length}</div>}
                            />
                            : <Popup
                                content='You have not completed all practice questions in this module'
                                trigger={<div><Icon color='red' name='x'/>Todo: {numberToDo} / {questionArr.length}</div>}
                            />}
                    </Grid.Column>
                </Grid>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === listIndex}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Practice Question</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {augmentQuestionData().map((question) => <PracticeQuestionInfoRow key={question.key} question={question}/> )}
                    </Table.Body>
                </Table>
            </Accordion.Content>
            <Divider fitted/>
        </Accordion>
    )
}

export default PracticeQuestionInfo
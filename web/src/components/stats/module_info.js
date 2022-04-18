import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";
import InfoRow from "./info_row";

const ModuleInfo = ({module, listIndex}) => {

    const completeCount = (questions) => {
        let count = 0
        for (const question of questions) {
            if (question.completed === true) {
                count++
            }
        }
        return count
    }

    const checkComplete = (questions, moduleFeedback) => {
        return (completeCount(questions) === questions.length) && moduleFeedback
    }

    const [activeIndex, setActiveIndex] = useState(0)

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
                        {module.name}
                        {checkComplete(module.questions, module.feedback) ?
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
                        Questions: {completeCount(module.questions)} / {module.questions.length}
                    </Grid.Column>
                    <Grid.Column width={1}>
                        Feedback: {module.feedback ?
                            <Popup
                                content='Thanks for your feedback'
                                trigger={<Icon color='green' name='comment'/>}
                                />
                            : <Popup
                            content='Please give feedback!'
                            trigger={<Icon color='red' name='comment'/>}
                            />}
                        {module.feedback ? module.feedbackTime : ''}
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
                            {module.questions.map((question) => <InfoRow key={question.key``} question={question}/> )}
                        </Table.Body>
                    </Table>
            </Accordion.Content>
            <Divider fitted/>
        </Accordion>
        )
}

export default ModuleInfo
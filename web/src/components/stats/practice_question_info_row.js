import React from 'react'
import {Table, Icon} from 'semantic-ui-react'

const PracticeQuestionInfoRow = ({ question }) => {
    // const completedTime = new Date(question.time * 1000).toLocaleString()
    let check
    let color
    let text

    if (question.completed) {
        check = 'check'
        color = 'green'
        text = 'completed'
    } else if (question.revealed) {
        check = 'check'
        color = 'green'
        text = 'revealed answer'
    } else if (question.giveup) {
        check = 'x'
        color= 'yellow'
        text= 'gave up'
    } else {
        check = 'question'
        color = 'red'
        text = 'todo'
    }

    return (
        <Table.Row>
            <Table.Cell>{question.question_key ?
                question.question_key
                : question}
            </Table.Cell>
            <Table.Cell textAlign='center'>
                <Icon color={color} name={check}/> {text}
            </Table.Cell>
        </Table.Row>
    )
}

export default PracticeQuestionInfoRow
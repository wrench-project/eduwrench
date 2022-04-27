import React from 'react'
import {Table, Icon} from 'semantic-ui-react'

const InfoRow = ({ question }) => {
    const completedTime = new Date(question.time * 1000).toLocaleString()
    return (
        <Table.Row>
            <Table.Cell>{question.question_key ?
                question.question_key
                : question}
            </Table.Cell>
            <Table.Cell textAlign='center'>{question.completed ?
                <Icon color='green' name='check'/>
                : <Icon color='red' name='x'/>}
            </Table.Cell>
            <Table.Cell textAlign='center'>{question.completed ?
                completedTime
                : <p>N/A</p>}</Table.Cell>
        </Table.Row>
    )
}

export default InfoRow
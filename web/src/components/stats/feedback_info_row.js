import React from 'react'
import {Table, Icon} from 'semantic-ui-react'

const FeedbackInfoRow = ({ module, tab, completed }) => {
    let check
    let color
    let text

    if (completed) {
        check = 'check'
        color = 'green'
        text = 'thanks for your feedback!'
    } else {
        check = 'question'
        color = 'red'
        text = 'your feedback would be appreciated'
    }

    return (
        <Table.Row>
            <Table.Cell textAlign='left'><strong>{module}. {tab}</strong></Table.Cell>
            <Table.Cell textAlign='left'>
                <Icon color={color} name={check}/> {text}
            </Table.Cell>
        </Table.Row>
    )
}

export default FeedbackInfoRow
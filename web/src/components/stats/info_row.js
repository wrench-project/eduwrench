import React from 'react'
import {Table, Icon} from 'semantic-ui-react'

const InfoRow = ({ question }) => {
    return (
        <Table.Row>
            <Table.Cell>{question.key}</Table.Cell>
            <Table.Cell textAlign='center'>{question.completed ?
                <Icon color='green' name='check'/>
                : <Icon color='red' name='x'/>}
            </Table.Cell>
            <Table.Cell textAlign='center'>{question.completed ?
                question.time
                : <p>N/A</p>}</Table.Cell>
        </Table.Row>
    )
}

export default InfoRow
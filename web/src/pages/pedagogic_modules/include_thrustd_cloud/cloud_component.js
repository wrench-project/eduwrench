import React from "react"
import { Form } from "semantic-ui-react"

const CloudComponent = ({ useCloud, handleChange, handleBlur, values, errors, touched }) => {

    if (useCloud == true) {
        return (
            <>
                <Form.Group widths="equal">
                    <Form.Input fluid name="cloudHosts"
                                label="Number of Cloud Hosts"
                                placeholder="1"
                                type="number"
                                min={1}
                        // not sure how many is the max for cloud hosts
                                max={128}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.cloudHosts}
                                error={errors.cloudHosts && touched.cloudHosts ? {
                                    content: "Please provide the number of cloud hosts in the range of [0, 128].",
                                    pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid
                                name="numVmInstances"
                                label="Number of VM Instances"
                                placeholder="0"
                                type="number"
                                min={0}
                        // again not sure of the max value
                                max={128}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numVmInstances}
                                error={errors.numVmInstances && touched.numVmInstances ? {
                                    content: "Please provide the pstate in the range of [0, 128].",
                                    pointing: "above"
                                } : null}
                    />
                </Form.Group>
            </>
        )
    } else {
        return (
            <></>
        )
    }
}

export default CloudComponent

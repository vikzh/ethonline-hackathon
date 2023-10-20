import React from "react";
import {Button, Card, Form, Input, Space} from "antd";

const SubmitButton = ({form}) => {
    const [submittable, setSubmittable] = React.useState(false);

    const handleSubmit = () => {
        if (submittable) {
            alert(true);
        }
    };

    // Watch all values
    const values = Form.useWatch([], form);
    React.useEffect(() => {
        form
            .validateFields({
                validateOnly: true,
            })
            .then(
                () => {
                    setSubmittable(true);
                },
                () => {
                    setSubmittable(false);
                },
            );
    }, [values]);
    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} onClick={handleSubmit}>
            Submit
        </Button>
    );
};

const ProposalCreation = ({form}) => {
    return (
        <Card
            title='Propose new Celestial'
            style={{marginBottom: 24}}
            bordered={false}
        >
            <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
                <Form.Item name="Name" label="Name:" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="X" label="X:" rules={[{required: true}]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="Y" label="Y:" rules={[{required: true}]}>
                    <Input disabled/>
                </Form.Item>
                <Form.Item name="Description" label="Description:">
                    <Input.TextArea/>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <SubmitButton form={form}/>
                        <Button htmlType="reset">Reset</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ProposalCreation;
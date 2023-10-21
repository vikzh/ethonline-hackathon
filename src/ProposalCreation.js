import React from "react";
import {Button, Card, Form, Input, Space} from "antd";
import {ethers} from "ethers";
import daoABI from './daoABI.json';

const SubmitButton = ({form}) => {
    const [submittable, setSubmittable] = React.useState(false);

    const handleSubmit = async () => {
        if (submittable) {
            const {
                X,
                Y,
                Name,
                Description
            } = form.getFieldsValue();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(process.env.REACT_APP_DAO_ADDRESS, daoABI, await provider.getSigner());
            try {
                await contract.createProposal(Name, Description, String(X), String(Y));
                form.resetFields();
            } catch (error) {
                console.error(error);
            }
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
        <Button htmlType="submit" disabled={!submittable} onClick={handleSubmit}>
            Submit
        </Button>
    );
};

const ProposalCreation = ({form}) => {
    return (
        <Card
            title='Propose new Object'
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
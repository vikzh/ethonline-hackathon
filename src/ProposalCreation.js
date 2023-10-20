import React from "react";
import {Button, Card, Form, Input, Space} from "antd";
import { ethers } from "ethers";
import daoABI from './daoABI.json';

const SubmitButton = ({form}) => {
    const [submittable, setSubmittable] = React.useState(false);

    const handleSubmit = async () => {
        if (submittable) {
            // alert(true);
            const {
                X,
                Y,
                Name,
                Description
            } = form.getFieldsValue();
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract("0x22eDafc8e684782b702fd4A91b13C5ddD4AEAFc4", daoABI, await provider.getSigner());
            await contract.createProposal(Name, Description, X, Y);
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
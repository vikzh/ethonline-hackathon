import { MetaMaskButton } from "@metamask/sdk-react-ui";
import {Card} from "antd";
import React from "react";

const Wallet = () =>{
    return (
        <Card
            title={<MetaMaskButton theme={"light"} color="white" buttonStyle={{display: 'flex', justifyContent: 'center'}} style={{width: '100%', display: 'flex', justifyContent: 'center'}}></MetaMaskButton>}
            style={{ marginBottom: 24 }}
            bodyStyle={{ textAlign: 'center' }}
            bordered={false}
        >
            Amount of Tokens: 100
        </Card>

    );
}

export default Wallet;
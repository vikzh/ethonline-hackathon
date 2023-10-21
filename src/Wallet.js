import { MetaMaskButton } from "@metamask/sdk-react-ui";
import {Card} from "antd";
import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import coinABI from "./coinABI.json";

const Wallet = () =>{
    const [balance, setBalance] = useState('Loading...');

    useEffect(() => {
        const callback = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(process.env.REACT_APP_COIN_ADDRESS, coinABI, await provider.getSigner());
            const smartContractBalance = await contract.balanceOf((await provider.getSigner()).address);
            setBalance(ethers.formatEther(smartContractBalance));
        };
        callback();
    }, []);

    return (
        <Card
            title={<MetaMaskButton theme={"light"} color="white" buttonStyle={{display: 'flex', justifyContent: 'center', width: '100%'}}></MetaMaskButton>}
            style={{ marginBottom: 24 }}
            bodyStyle={{ textAlign: 'center' }}
            bordered={false}
        >
            You have earned Celestial Coins: {balance}
        </Card>

    );
}

export default Wallet;
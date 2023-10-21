import React, {useEffect, useState} from 'react';
import {List, Skeleton, Card} from 'antd';
import {ethers} from "ethers";
import daoABI from "./daoABI.json";


const count = 20;
const fakeDataUrl = `https://testnets.tableland.network/api/v1/query?statement=SELECT%20%2A%20FROM%20celestial_table_314159_594`;
const Proposals = () => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    // const handleVote = async (positivity = true) => {
    //     const provider = new ethers.BrowserProvider(window.ethereum);
    //     const contract = new ethers.Contract(process.env.REACT_APP_COIN_ADDRESS, coinABI, await provider.getSigner());
    //     const accounts = await provider.send("eth_requestAccounts", []);
    //     const account = accounts[0];
    //     const balance = await contract.balanceOf(account);
    //     alert(balance);
    // };

    const vote = (proposalId, positivity = true) => {
        const callback = async (proposalId, positivity = true) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(process.env.REACT_APP_DAO_ADDRESS, daoABI, await provider.getSigner());
            try {
                const proposals = await contract.vote(proposalId, positivity);
            } catch (error) {
                console.error(error);
            }
        };

        callback(proposalId, positivity);
    }

    const executeProposal = (proposalId) => {
        const callback = async (proposalId) => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(process.env.REACT_APP_DAO_ADDRESS, daoABI, await provider.getSigner());
            try {
                const proposals = await contract.executeProposal(proposalId);
            } catch (error) {
                console.error(error);
            }
        };

        callback(proposalId);
    }

    useEffect(() => {
        // fetch(fakeDataUrl)
        //     .then((res) => res.json())
        //     .then((res) => {
        //         setInitLoading(false);
        //         setData(res);
        //         setList(res);
        //     });
        const callback = async () => {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(process.env.REACT_APP_DAO_ADDRESS, daoABI, await provider.getSigner());
            const proposals = await contract.getProposals();
            setInitLoading(false);
            setData(proposals);
            setList(proposals);
        };

        callback();
    }, []);
    return (
        <Card
            title='Propose new Celestial'
            bordered={false}
        >
            <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item
                        actions={[<a key="list-loadmore-edit" style={{color: 'green'}} onClick={() => vote(item.id, true)}>{`Vote Yes (${item.yesVotes})`}</a>,
                            <a key="list-loadmore-more" style={{color: 'red'}} onClick={() => vote(item.id, false)}>{`Vote No (${item.noVotes})`}</a>,
                            <a key="list-loadmore-execute" style={{color: 'blue'}} onClick={() => executeProposal(item.id)}>Execute</a>]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                title={`${item.name} [ ${item.x}: ${item.y}]`}
                                description={item.description}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </Card>
    );
};
export default Proposals;
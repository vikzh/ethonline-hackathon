import {useState, useEffect} from "react";
import React from 'react';
import celestial from "d3-celestial";
import {Row, Col, Card, Tooltip, Form} from 'antd';
import Wallet from "./Wallet";
import ProposalCreation from "./ProposalCreation";
import Proposals from "./Proposals";

export default function App() {
    const count = 20;
    const tablelandDataUrl = `https://testnets.tableland.network/api/v1/query?statement=SELECT%20%2A%20FROM%20celestial_table_314159_613`;

    const [form] = Form.useForm();

    useEffect(() => {
        function getPosition(e) {
            var p = document.getElementById('celestial-map').getBoundingClientRect(),
                x = e.offsetX,
                y = e.offsetY,
                inv = window.Celestial.mapProjection.invert([x, y]);
            const [invX, invY] = inv;
            if(!isNaN(invX) && !isNaN(invY)) {
                form.setFieldValue('X', invX);
                form.setFieldValue('Y', invY);
            }
            return inv; // [right ascension -180...180 degrees, declination -90...90 degrees]
        }

        document.getElementById('celestial-map').addEventListener('click', getPosition, false);
    }, []);

    return (
        <div className="App">
            <div>
                <Row gutter={24}>
                    <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='Atlas Data DAO'
                            bordered={false}
                        >
                        <div>
                            <div id="celestial-map" style={{display: 'flex', justifyContent: 'center'}}></div>
                        </div>
                        </Card>
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                        <Wallet/>
                        <ProposalCreation form={form}/>
                    </Col>
                </Row>
            <Proposals/>
            </div>
        </div>
    );
}

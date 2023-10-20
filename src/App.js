import {useState, useEffect} from "react";
import React from 'react';
import celestial from "d3-celestial";
import {Row, Col, Card, Tooltip, Form} from 'antd';
import Wallet from "./Wallet";
import ProposalCreation from "./ProposalCreation";
import Proposals from "./Proposals";

export default function App() {
    const [form] = Form.useForm();
    const Celestial = celestial.Celestial();
    window.Celestial = Celestial;

    const config = {
        width: 570,
        projection: "orthographic",
        background: {fill: "#fff", stroke: "#000", opacity: 1, width: 1},
        container: "celestial-map",
        datapath: "https://ofrohn.github.io/data/",
        stars: {
            colors: false,
            names: false,
            style: {fill: "#000", opacity: 1},
            limit: 6,
            size: 5
        },
        dsos: {
            show: true,
            colors: false,  // Show DSOs in symbol colors, if not use fill-style
            style: {fill: "#cccccc", stroke: "#cccccc", width: 3, opacity: 1}, // Default style for dsos
            names: true,   //Show DSO names
            namestyle: {
                fill: "#cccccc",
                font: "12px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif",
                align: "left",
                baseline: "bottom"
            }
        },
        mw: {
            style: {fill: "#fff", opacity: 0.1}
        },
    };

    useEffect(() => {
        Celestial.display(config);
        handleDateChange();
    }, []);

    const handleDateChange = () => {
        var lineStyle = {
                stroke: "#f00",
                fill: "rgba(255, 204, 204, 0.4)",
                width: 20,
                opacity: 0.6
            },
            textStyle = {
                fill: "#f00",
                font: "bold 15px Helvetica, Arial, sans-serif",
                align: "center",
                baseline: "middle"
            };

        var jsonLine = {
            "type": "FeatureCollection",
            // this is an array, add as many objects as you want
            "features": [
                {
                    "type": "Feature",
                    "id": "SummerTriangle",
                    "properties": {
                        // Name
                        "n": "*",
                        // Location of name text on the map
                        "loc": [100, 5]
                    }, "geometry": {
                        // the line object as an array of point coordinates
                        "type": "Point",
                        "coordinates": [100, 0]
                    }
                }
            ]
        };

        Celestial.add({
            type: "line",

            callback: function (error, json) {

                if (error) return console.warn(error);
                // Load the geoJSON file and transform to correct coordinate system, if necessary
                var asterism = Celestial.getData(jsonLine, config.transform);

                // Add to celestial objects container in d3
                Celestial.container.selectAll(".asterisms")
                    .data(asterism.features)
                    .enter().append("path")
                    .attr("class", "ast");
                // Trigger redraw to display changes
                Celestial.redraw();
            },

            redraw: function () {

                // Select the added objects by class name as given previously
                Celestial.container.selectAll(".ast").each(function (d) {
                    // Set line styles
                    Celestial.setStyle(lineStyle);
                    // Project objects on map
                    Celestial.map(d);
                    // draw on canvas
                    Celestial.context.fill();
                    Celestial.context.stroke();

                    // If point is visible (this doesn't work automatically for points)
                    if (Celestial.clip(d.properties.loc)) {
                        // get point coordinates
                        var pt = Celestial.mapProjection(d.properties.loc);
                        // Set text styles
                        Celestial.setTextStyle(textStyle);
                        // and draw text on canvas
                        Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
                    }
                });
            }
        });

        function getPosition(e) {
            var p = document.getElementById('celestial-map').getBoundingClientRect(),
                x = e.offsetX,
                y = e.offsetY,
                inv = Celestial.mapProjection.invert([x, y]);
            const [invX, invY] = inv;
            if(!isNaN(invX) && !isNaN(invY)) {
                form.setFieldValue('X', invX);
                form.setFieldValue('Y', invY);
            }
            return inv; // [right ascension -180...180 degrees, declination -90...90 degrees]
        }

        document.getElementById('celestial-map').addEventListener('click', getPosition, false);
    };

    return (
        <div className="App">
            <div>
                <Row gutter={24}>
                    <Col xl={16} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='Celestial Data DAO'
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

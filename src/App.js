import {useState, useEffect} from "react";
import React from 'react';
import celestial from "d3-celestial";
import { Row, Col, Card, Tooltip } from 'antd';
import {
    Form,
    Input,
    Button,
    Space
} from 'antd';
const FormItem = Form.Item;
const Celestial = celestial.Celestial();
window.Celestial = Celestial;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
    },
};

const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable}>
            Submit
        </Button>
    );
};

export default function App() {
    const [date, setDate] = useState("2023-09-25T04:00:00+0000");
    const [LAT, LON] = [36.525321, -121.815916];
    const FONT = "Raleway";

    const config = {
        width: 800,
        projection: "orthographic",
        center: [-65, 0],
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
        handleDateChange()
    }, [date]);

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
            console.log(inv);
            return inv; // [right ascension -180...180 degrees, declination -90...90 degrees]
        }

        document.getElementById('celestial-map').addEventListener('mousemove', getPosition, false);
    };

    const [form] = Form.useForm();

    return (
        <div className="App">
            <div>
                <Row gutter={24}>
                    <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='Celestial Data DAO'
                            bordered={false}
                        >
                            <div>
                                <div id="celestial-map"></div>
                            </div>
                        </Card>
                    </Col>
                    <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                        <Card
                            title='Propose new Celestial'
                            style={{ marginBottom: 24 }}
                            bordered={false}
                        >
                            <Form form={form} name="validateOnly" layout="vertical" autoComplete="off">
                                <Form.Item name="Name" label="Name:" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="X" label="X:" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="Y" label="Y:" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="Description" label="Description:">
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item>
                                    <Space>
                                        <SubmitButton form={form} />
                                        <Button htmlType="reset">Reset</Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Card>
                        <Card
                            title='title'
                            style={{ marginBottom: 24 }}
                            bodyStyle={{ textAlign: 'center' }}
                            bordered={false}
                        >
                           gauge
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col xl={12} lg={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='title'
                            bordered={false}
                        >
                            <Row style={{ padding: '16px 0' }}>
                                <Col span={8}>
                                    pie
                                </Col>
                                <Col span={8}>
                                    Pie
                                </Col>
                                <Col span={8}>
                                    Pie
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='title'
                            bordered={false}
                            bodyStyle={{ overflow: 'hidden' }}
                        >
                            tag cloud
                        </Card>
                    </Col>
                    <Col xl={6} lg={12} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <Card
                            title='title'
                            bodyStyle={{ textAlign: 'center', fontSize: 0 }}
                            bordered={false}
                        >
                            water wave
                        </Card>
                    </Col>
                </Row>
            </div>


            <button onClick={handleDateChange}>Change date</button>
        </div>
    );
}

import { useState, useEffect } from "react";
import celestial from "d3-celestial";

const Celestial = celestial.Celestial();
window.Celestial = Celestial;

export default function App() {
    const [date, setDate] = useState("2023-09-25T04:00:00+0000");
    const [LAT, LON] = [36.525321, -121.815916];
    const FONT = "Raleway";

    const config = {
        width:800,
        projection: "orthographic",
        center: [-65, 0],
        background: { fill: "#000", stroke: "#999", opacity: 1, width: 1 },
        container: "celestial-map17",
        datapath: "https://ofrohn.github.io/data/",
        stars: {
            colors: false,
            names: false,
            style: { fill: "#fff", opacity:1 },
            limit: 6,
            size:5
        },
        dsos: {
            show: true,
            colors: false,  // Show DSOs in symbol colors, if not use fill-style
            style: { fill: "#cccccc", stroke: "#cccccc", width: 2, opacity: 1 }, // Default style for dsos
            names: true,   //Show DSO names
            namestyle: { fill: "#cccccc", font: "12px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif", align: "left", baseline: "bottom" }
        },
        mw: {
            style: { fill:"#fff", opacity: 0.1 }
        },
    };

    useEffect(() => {
        Celestial.display(config);
        Celestial.skyview({ date: date });
    }, [date]);

    const handleDateChange = () => {
        setDate(Date.now());
    };

    return (
        <div className="App">
            <button onClick={handleDateChange}>Change date</button>
            <div id="map-container">
                <div id="map"></div>
            </div>
        </div>
    );
}

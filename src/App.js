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
        container: "celestial-map",
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
            style: { fill: "#cccccc", stroke: "#cccccc", width: 10, opacity: 1 }, // Default style for dsos
            names: true,   //Show DSO names
            namestyle: { fill: "#cccccc", font: "12px 'Lucida Sans Unicode', Trebuchet, Helvetica, Arial, sans-serif", align: "left", baseline: "bottom" }
        },
        mw: {
            style: { fill:"#fff", opacity: 0.1 }
        },
    };

    useEffect(() => {
        Celestial.display(config);
        handleDateChange()
    }, [date]);

    const handleDateChange = () => {
        var lineStyle = {
                stroke:"#f00",
                fill: "rgba(255, 204, 204, 0.4)",
                width: 3,
                opacity: 0.6
            },
            textStyle = {
                fill:"#f00",
                font: "bold 15px Helvetica, Arial, sans-serif",
                align: "center",
                baseline: "middle"
            };

        var jsonLine = {
            "type":"FeatureCollection",
            // this is an array, add as many objects as you want
            "features":[
                {"type":"Feature",
                    "id":"SummerTriangle",
                    "properties": {
                        // Name
                        "n":"Summer Triangle",
                        // Location of name text on the map
                        "loc": [-67.5, 52]
                    }, "geometry":{
                        // the line object as an array of point coordinates
                        "type":"MultiLineString",
                        "coordinates":[[
                            [-80.7653, 38.7837],
                            [-62.3042, 8.8683],
                            [-49.642, 45.2803],
                            [-80.7653, 38.7837]
                        ]]
                    }
                }
            ]};

        Celestial.add({
            type:"line",

            callback: function(error, json) {

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

            redraw: function() {

                // Select the added objects by class name as given previously
                Celestial.container.selectAll(".ast").each(function(d) {
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
            var p = document.getElementById ('celestial-map').getBoundingClientRect(),
                x = e.offsetX,
                y = e.offsetY,
                inv = Celestial.mapProjection.invert([x, y]);
            console.log(inv);
            return inv; // [right ascension -180...180 degrees, declination -90...90 degrees]
        }
        document.getElementById('celestial-map').addEventListener('mousemove', getPosition, false);
    };

    return (
        <div className="App">
            <button onClick={handleDateChange}>Change date</button>
                <div id="celestial-map"></div>
        </div>
    );
}

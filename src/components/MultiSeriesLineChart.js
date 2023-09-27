import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";

const MultiSeriesLineChart = () => {
    const [data, setData] = useState([]);
    const [averagedData, setAveragedData] = useState([]);
    const [selectedCharacteristic, setSelectedCharacteristic] = useState("valence");
    const [minValue, setMinValue] = useState(null);
    const [maxValue, setMaxValue] = useState(null);
    const chartRef = useRef(null);
    const initialMount = useRef(true);

    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    const genres = ["Dance/Electronic", "latin", "pop", "hip hop", "rock", "R&B"];
    const audioCharacteristics = [
        "duration_ms", "popularity", "danceability", "energy", "loudness",
        "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"
    ];

    useEffect(() => {
        d3.csv(dataset).then((data) => {
            setData(data);
        });
    }, []);

    useEffect(() => {
        if (data.length === 0) return;
        if (initialMount.current) {
            initialMount.current = false;
            return;
        }
    
        const years = [...new Set(data.map(d => +d.year))].sort((a, b) => a - b);
    
        const averages = years.map(year => ({
            year, ...genres.reduce((acc, genre) => {
                const filteredData = data.filter(d => d.genre.includes(genre) && +d.year === year);
                const sum = filteredData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
                const avg = sum / filteredData.length || 0;
                acc[genre] = avg; // Store original average values, no normalization needed
                return acc;
            }, {})
        }));
    
        setAveragedData(averages);
    
        // Dynamically calculate the min and max values based on the selected characteristic
        const allAverages = averages.flatMap(d => Object.values(d).filter(v => !isNaN(v) && v !== d.year));
        setMinValue(d3.min(allAverages));
        setMaxValue(d3.max(allAverages));
    
    }, [data, selectedCharacteristic]);
    

    useEffect(() => {
        if (averagedData.length === 0 || minValue === null || maxValue === null) return;
        d3.select(chartRef.current).selectAll("svg").remove();
        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const years = averagedData.map(d => d.year);
        const x = d3.scaleLinear().domain(d3.extent(years)).range([marginLeft, width - marginRight]);

        // Set Y Scale Domain to [minValue, maxValue] 
        const y = d3.scaleLinear().domain([minValue, maxValue]).range([height - marginBottom, marginTop]);
        const line = d3.line().x(d => x(d.year)).y(d => y(d.value)); 
        const numTicks = Math.max(3, height / 40);

        genres.forEach((genre, index) => {
            const lineData = averagedData.map(d => ({ year: d.year, value: d[genre] }));
            const path = svg.append("path")
                .datum(lineData)
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[index])
                .attr("stroke-width", 1.5)
                .attr("d", line);
    
            const totalLength = path.node().getTotalLength();
            path
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        });

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Format Y Axis Labels to Reflect Actual Values
        svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(numTicks).tickFormat(d => {
            // If the selected characteristic is 'duration_ms', format the tick values differently
            if (selectedCharacteristic === "duration_ms") {
                return (d / 1000).toFixed(1) + 's'; // Format as seconds with one decimal place
            } else {
                return d3.format(".2")(d); // Use existing formatting for other characteristics
            }
        }))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone().attr("x2", width - marginLeft - marginRight).attr("stroke-opacity", 0.1))
        .call(g => g.append("text").attr("x", -marginLeft).attr("y", 10).attr("fill", "currentColor").attr("text-anchor", "start").text(`↑ Average ${selectedCharacteristic}`));


    }, [averagedData, selectedCharacteristic, minValue, maxValue]);

    return (
        <div ref={chartRef}>
            <h1>Audio Characteristics Average Over the Years</h1>
            <select onChange={(e) => setSelectedCharacteristic(e.target.value)}>
                {audioCharacteristics.map((characteristic) => (
                    <option key={characteristic} value={characteristic}>
                        {characteristic}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MultiSeriesLineChart;

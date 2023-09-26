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

        // Calculate min and max values for normalization
        const allCharacteristicValues = data.map(d => +d[selectedCharacteristic]).filter(v => !isNaN(v));
        const localMinValue = d3.min(allCharacteristicValues);
        const localMaxValue = d3.max(allCharacteristicValues);

        setMinValue(localMinValue);
        setMaxValue(localMaxValue);

        const averages = years.map(year => ({
            year, ...genres.reduce((acc, genre) => {
                const filteredData = data.filter(d => d.genre.includes(genre) && +d.year === year);
                const sum = filteredData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
                const avg = sum / filteredData.length || 0;
                const normalizedAvg = (avg - localMinValue) / (localMaxValue - localMinValue);
                acc[genre] = normalizedAvg;
                return acc;
            }, {})
        }));

        setAveragedData(averages);
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

        // Set Y Scale Domain to [0, 1] for Normalized Values
        const y = d3.scaleLinear().domain([0, 1]).range([height - marginBottom, marginTop]);
        const line = d3.line().x(d => x(d.year)).y(d => y(d.value));
        const numTicks = Math.max(3, height / 40);

        genres.forEach((genre, index) => {
            svg.append("path")
                .datum(averagedData.map(d => ({ year: d.year, value: d[genre] })))
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[index])
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Format Y Axis Labels to Reflect Actual Values
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(numTicks).tickFormat(d => d * (maxValue - minValue) + minValue))
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

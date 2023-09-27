import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";

const MultiSeriesLineChart = () => {
    const tooltipRef = useRef(null);
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

        // const averages = years.map(year => ({
        //     year, ...genres.reduce((acc, genre) => {
        //         const filteredData = data.filter(d => d.genre.includes(genre) && +d.year === year);
        //         const sum = filteredData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
        //         const avg = sum / filteredData.length || 0;
        //         acc[genre] = avg; // Store original average values, no normalization needed
        //         return acc;
        //     }, {})
        // }));

        const averages = years.map(year => {
            const yearData = data.filter(d => +d.year === year);
            const overallSum = yearData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
            const overallAvg = overallSum / yearData.length || 0;

            return {
                year,
                overall: overallAvg, // Store the overall average
                ...genres.reduce((acc, genre) => {
                    const filteredData = data.filter(d => d.genre.includes(genre) && +d.year === year);
                    const sum = filteredData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
                    const avg = sum / filteredData.length || 0;
                    acc[genre] = avg;
                    return acc;
                }, {})
            };
        });

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

        // Draw the overall average line
        const overallPath = svg.append("path")
            .datum(averagedData.map(d => ({ year: d.year, value: d.overall, genre: 'Overall' }))) // Use the overall average value
            .attr("class", "line") // Assign a class to the line for styling
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("d", line);

        const overallLength = overallPath.node().getTotalLength();

        overallPath
            .attr("stroke-dasharray", overallLength + " " + overallLength)
            .attr("stroke-dashoffset", overallLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);

        overallPath
            .on('mouseover', function (event) {
                d3.select(tooltipRef.current).style('visibility', 'visible');

                svg.selectAll('.line')
                    .transition()
                    .duration(100)
                    .attr('opacity', 0.1);

                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
            })
            .on('mousemove', function (event) {
                const pointer = d3.pointer(event);
                const mouseX = pointer[0];
                const year = Math.round(x.invert(mouseX));

                const avgValue = averagedData.find(d => d.year === year)?.overall || 0; // For overallPath, this is always the overall value

                d3.select(tooltipRef.current)
                    .style('top', (event.pageY - 10) + 'px')
                    .style('left', (event.pageX + 10) + 'px')
                    .html(`
                <p>Genre: Overall</p>
                <p>Year: ${year}</p>
                <p>Average: ${avgValue.toFixed(2)}</p>
            `);
            })
            .on('mouseout', function () {
                d3.select(tooltipRef.current).style('visibility', 'hidden');

                svg.selectAll('.line')
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
            });


        genres.forEach((genre, index) => {
            const lineData = averagedData.map(d => ({ year: d.year, value: d[genre] }));
            const path = svg.append("path")
                .datum(lineData)
                .attr("class", "line") // Assign a class to the line
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

            path
                .on('mouseover', function (event) { // Capture the event object as the first parameter
                    d3.select(tooltipRef.current).style('visibility', 'visible'); // show tooltip
                    // Reduce the opacity of all paths except the one being hovered over

                    // Smoothly reduce the opacity of all lines
                    svg.selectAll('.line')
                        .transition() // Start a transition
                        .duration(100) // Set its duration to 300 milliseconds
                        .attr('opacity', 0.1); // Reduce opacity of all lines using class

                    // Smoothly highlight the hovered line
                    d3.select(this)
                        .transition() // Start a transition
                        .duration(200) // Set its duration to 300 milliseconds
                        .attr('opacity', 1); // Increase the opacity of the hovered line
                })
                .on('mousemove', function (event) {
                    const pointer = d3.pointer(event);
                    const mouseX = pointer[0];
                    const year = Math.round(x.invert(mouseX));
                    // Determine if the hovered line is a genre line or the overall line
                    const isOverallLine = d3.select(this).datum().some(d => d.genre === 'Overall'); // Check if any datum has the genre 'Overall'

                    const avgValue = isOverallLine
                        ? averagedData.find(d => d.year === year)?.overall || 0
                        : lineData.find(d => d.year === year)?.value || 0;

                    const displayedGenre = isOverallLine ? 'Overall' : genre; // Use a unique name here

                    d3.select(tooltipRef.current)
                        .style('top', (event.pageY - 10) + 'px')
                        .style('left', (event.pageX + 10) + 'px')
                        .html(`
                            <p>Genre: ${displayedGenre}</p>
                            <p>Year: ${year}</p>
                            <p>Average: ${avgValue.toFixed(2)}</p>
                        `);
                })
                .on('mouseout', () => {
                    // Hide Tooltip
                    d3.select(tooltipRef.current).style('visibility', 'hidden');

                    // Smoothly reset the opacity of all lines back to 1
                    svg.selectAll('.line')
                        .transition() // Start a transition
                        .duration(200) // Set its duration to 300 milliseconds
                        .attr('opacity', 1); // Reset opacity of all lines using class
                });
        });


        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Format Y Axis Labels to Reflect Actual Values
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y).ticks(numTicks).tickFormat(d => {
                // If the selected characteristic is 'duration_ms' or 'tempo', format the tick values differently
                if (selectedCharacteristic === "duration_ms") {
                    return (d / 1000).toFixed(1) + 's'; // Format as seconds with one decimal place
                } else if (selectedCharacteristic === "tempo") {
                    return (d3.format(".3")(d) + 's'); // Format as seconds with one decimal place
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
            <div ref={tooltipRef} style={{ position: 'absolute', visibility: 'hidden', background: '#fff', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}></div>
        </div>
    );
};

export default MultiSeriesLineChart;

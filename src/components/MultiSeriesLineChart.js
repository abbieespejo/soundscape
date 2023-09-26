import React, { useEffect, useRef, useState, chartRef } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";
import "./MultiSeriesLineChart.css";

const MultiSeriesLineChart = () => {
  /* Styling for the rendered chart */
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;
  const chartRef = useRef(null);
  const initialMount = useRef(true);
  const [data, setData] = useState([]);
  const audioCharacteristics = [
    "duration_ms",
    "popularity",
    "danceability",
    "energy",
    "loudness",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
  ];
  const genres = ["Dance/Electronic", "latin", "pop", "hip hop", "rock", "R&B"];
  const years = Array.from(new Set(data.map(d => +d.year)));  // retrieve the years for iteration & data storage
  const [averagedData, setAveragedData] = useState([]);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState("duration_ms");
  useEffect(() => {
    console.log("Fetching data");
    d3.csv(dataset).then((data) => {
      setData(data);
    });
  }, []); // This will only run once on component mount to fetch the data

  useEffect(() => {
    if (data.length === 0) return; // Ensure data is loaded before calculating averages
    
    if (initialMount.current) {
      initialMount.current = false; // It's initial mount, don't run the effect body yet.
      return;
    }
    console.log("Processing data...");
    const averages = {};
    years.forEach((year) => {
      averages[year] = {}; // Initialise an empty object for each year
    });
    genres.forEach((genre) => {
      years.forEach((year) => {
        const filteredData = data.filter(
          (d) => d.genre.includes(genre) && +d.year === year
        );
        const sum = filteredData.reduce(
          (acc, curr) => acc + +curr[selectedCharacteristic],
          0
        );
        const avg = sum / filteredData.length || 0;
        averages[year][genre] = avg; // Store the average value for each genre under the corresponding year
      });
    });
    setAveragedData(averages);
    console.log(averages);
  }, [data, selectedCharacteristic]);

  // useEffect(() => {
  //   const svg = d3.select(chartRef.current)
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height);
  //   const x = d3
  //     .scaleLinear()
  //     .domain(d3.extent(years))
  //     .range([marginLeft, width - marginRight]);

  //   const allAverages = Object.values(averagedData).flatMap((year) =>
  //     Object.values(year)
  //   );
  //   const minVal = d3.min(allAverages);
  //   const maxVal = d3.max(allAverages);

  //   const y = d3
  //     .scaleLinear()
  //     .domain([minVal, maxVal])
  //     .range([height - marginBottom, marginTop]);

  //   const line = d3.line()
  //     .x(d => x(d.year))
  //     .y(d => y(d.value));

  //   // Render each genre as a line on the chart
  //   if (Object.keys(averagedData).length > 0) {
  //     genres.forEach((genre, index) => {
  //       svg
  //         .append("path")
  //         .datum(years)
  //         .attr("fill", "none")
  //         .attr("stroke", d3.schemeCategory10[index]) // color based on genre's index
  //         .attr("stroke-width", 1.5)
  //         .attr("d", d => line(d.map(year => ({
  //           year: year,
  //           value: averagedData[year][genre]
  //         }))));

  //     });
  //   }
  //   // X-Axis
  //   svg
  //     .append("g")
  //     .attr("transform", `translate(0,${height - marginBottom})`)
  //     .call(
  //       d3
  //         .axisBottom(x)
  //         .ticks(width / 80)
  //         .tickSizeOuter(0)
  //     );
  //   // Y-Axis
  //   svg
  //     .append("g")
  //     .attr("transform", `translate(${marginLeft},0)`)
  //     .call(d3.axisLeft(y).ticks(height / 40))
  //     .call((g) => g.select(".domain").remove())
  //     .call((g) =>
  //       g
  //         .selectAll(".tick line")
  //         .clone()
  //         .attr("x2", width - marginLeft - marginRight)
  //         .attr("stroke-opacity", 0.1)
  //     )
  //     .call((g) =>
  //       g
  //         .append("text")
  //         .attr("x", -marginLeft)
  //         .attr("y", 10)
  //         .attr("fill", "currentColor")
  //         .attr("text-anchor", "start")
  //         .text(`↑ Average ${selectedCharacteristic}`)
  //     );

  // });

  return (
    <div id="line-chart-container" ref={chartRef}>
      {/* <h1>Audio Characteristics Average Over the Years</h1>
      <select onChange={(e) => setSelectedCharacteristic(e.target.value)}>
        {audioCharacteristics.map((characteristic) => (
          <option key={characteristic} value={characteristic}>
            {characteristic}
          </option>
        ))}
      </select> */}
    </div>
  );
};

export default MultiSeriesLineChart;

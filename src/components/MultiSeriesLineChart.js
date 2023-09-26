import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";

const MultiSeriesLineChart = () => {
  // Declaring States and Refs
  const [data, setData] = useState([]);
  const [averagedData, setAveragedData] = useState([]);
  const [selectedCharacteristic, setSelectedCharacteristic] = useState("valence");
  const chartRef = useRef(null);
  const initialMount = useRef(true);

  // Declaring Constants
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
    const averages = years.map(year => ({ year, ...genres.reduce((acc, genre) => {
      const filteredData = data.filter(d => d.genre.includes(genre) && +d.year === year);
      const sum = filteredData.reduce((acc, curr) => acc + +curr[selectedCharacteristic], 0);
      const avg = sum / filteredData.length || 0;
      acc[genre] = avg;
      return acc;
    }, {})}));
    setAveragedData(averages);
    console.log(averagedData);
  }, [data, selectedCharacteristic]);

  useEffect(() => {
    if (averagedData.length === 0) return;
    d3.select(chartRef.current).selectAll("svg").remove();
    const svg = d3.select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
      
    const years = averagedData.map(d => d.year);
    const x = d3.scaleLinear().domain(d3.extent(years)).range([marginLeft, width - marginRight]);
    const allAverages = averagedData.flatMap(d => Object.values(d).filter(v => !isNaN(v)));
      
    // Log values to debug
    console.log('All Averages:', allAverages);
      
    const minValue = d3.min(allAverages);
    const maxValue = d3.max(allAverages);
      
    // Log values to debug
    console.log('Min Value:', minValue);
    console.log('Max Value:', maxValue);
      
    // Check if minValue or maxValue is invalid, then return
    if (minValue === undefined || maxValue === undefined || isNaN(minValue) || isNaN(maxValue)) {
      console.error('Invalid min or max value');
      return;
    }
    
    const y = d3.scaleLinear().domain([minValue, maxValue]).range([height - marginBottom, marginTop]);
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
    
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(numTicks))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").clone().attr("x2", width - marginLeft - marginRight).attr("stroke-opacity", 0.1))
      .call((g) => g.append("text").attr("x", -marginLeft).attr("y", 10).attr("fill", "currentColor").attr("text-anchor", "start").text(`↑ Average ${selectedCharacteristic}`));
    
  }, [averagedData, selectedCharacteristic]);
  

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

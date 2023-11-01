import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";
import './CorrelationHeatmap.css';

const CorrelationHeatmap = () => {

  const [data, setData] = useState([]);
  const [correlations, setCorrelations] = useState([]);
  // Ref for the tooltip
  const tooltipRef = useRef();

  useEffect(() => {
    // Read and parse the CSV data
    d3.csv(dataset).then((data) => {
      setData(data);
      console.log('DATA HAS BEEN LOADED', data);
    });
  }, []);
  

  const interestedFields = ["duration_ms", "year", "popularity", "danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"];

  const corr = (x, y) => {
    const n = x.length;
    if (y.length !== n)
      throw new Error("The two columns must have the same length.");
    const x_ = d3.mean(x);
    const y_ = d3.mean(y);
    const XY = d3.sum(x, (_, i) => (x[i] - x_) * (y[i] - y_));
    const XX = d3.sum(x, (d) => (d - x_) ** 2);
    const YY = d3.sum(y, (d) => (d - y_) ** 2);
    return XY / Math.sqrt(XX * YY);
  }

  useEffect(() => {
    if (data.length > 0) {
      const newCorrelations = d3.cross(interestedFields, interestedFields).map(([a, b]) => {
        const x = data.map(d => d[a]);
        const y = data.map(d => d[b]);
        const correlation = corr(x, y);
        return {
          a,
          b,
          correlation: Number(correlation.toPrecision(10))
        };
      });
      setCorrelations(newCorrelations);
      console.log('New correlations:', newCorrelations);
    }
  }, [data]);

  const svgRef = useRef();
  const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Clear previous rendering
    svg.selectAll("*").remove();
    // Define a linear gradient
    const defs = svg.append("defs");

    const linearGradient = defs.append("linearGradient")
      .attr("id", "gradient-colors")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    // Define the gradient colors
    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#775ae6");

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ffffff");

    // Define the margins with enough space for axis labels
    const margin = { top: 120, right: 20, bottom: 50, left: 120 }; // Increased top margin
    const width = 700 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    // Adjust the xScale and yScale for the margins
    const xScale = d3.scaleBand()
      .domain(interestedFields)
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(interestedFields)
      .range([0, height]);

    const colorScale = d3.scaleLinear()
      .domain([-1, 1])
      .range(["#ffffff", "#775ae6"]); // white to purple gradient

    // Append a 'g' element for the heatmap squares, translated with the left margin.
    const heatmap = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the squares for the heatmap.
    heatmap.selectAll("rect")
      .data(correlations)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.a))
      .attr("y", d => yScale(d.b))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.correlation))
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .html(`Pair: ${d.a} & ${d.b}<br>Correlation: ${d.correlation.toFixed(2)}`);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Add the correlation values text.
    heatmap.selectAll("text")
      .data(correlations)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.a) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.b) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em") // Vertically center
      .attr("text-anchor", "middle") // Horizontally center
      .text(d => d.correlation.toFixed(2))
      .attr("fill", d => Math.abs(d.correlation) > 0.6 ? "white" : "black")
      .attr("class", "correlation-text")
      .style("pointer-events", "none");

    // Add the X Axis
    const xAxisGroup = svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(${margin.left},${margin.top - 20})`)
      .call(d3.axisBottom(xScale));
    xAxisGroup.selectAll("text")
      .style("text-anchor", "start")
      .attr("dx", "0em")
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)");

    // Remove the path element which is the line in the axis
    xAxisGroup.select('.domain').remove();
    xAxisGroup.selectAll('.tick line').remove();

    // Add the Y Axis
    const yAxisGroup = svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yScale));

    // Remove the path element which is the line in the axis
    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('.tick line').remove();


    // Make sure the height of the SVG is enough to fit the x-axis labels
    <svg ref={svgRef} width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}></svg>


    // Define dimensions for the legend
    const legendWidth = 20;
    const legendHeight = 100;

    // Position legend on the SVG
    const legend = svg.append("g")
      .attr("transform", `translate(${width + margin.left + 50}, ${margin.top})`);

    // Draw the legend rectangle filled with the gradient
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#gradient-colors)");

    // Create a scale and axis for the legend
    const legendScale = d3.scaleLinear()
      .range([legendHeight, 0])
      .domain([1, -1]);

    const legendAxis = d3.axisRight(legendScale)
      .ticks(5) 
      .tickFormat(d3.format(".1f"));

    // Draw the legend axis
    legend.append("g")
      .attr("class", "legend-axis")
      .attr("transform", `translate(${legendWidth}, 0)`)
      .call(legendAxis);

  }, [correlations]);



  return (
    <div>
      <h1>Correlation heatmap</h1>
      {/* Implement your D3.js Plotting code here */}
      <svg ref={svgRef} width={1000} height={1000}></svg>
      <div ref={tooltipRef} className="tooltip" style={{ opacity: 0 }}></div>
    </div>
  );
};

export default CorrelationHeatmap;

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";

const CorrelationHeatmap = () => {
  const [data, setData] = useState([]);
  const [correlations, setCorrelations] = useState([]);

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

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // Clear previous rendering
    svg.selectAll("*").remove();
  
    // Your D3 rendering logic here
    const xScale = d3.scaleBand()
      .domain(interestedFields)
      .range([0, 900]);

    const yScale = d3.scaleBand()
      .domain(interestedFields)
      .range([0, 900]);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
      .domain([-1, 1]);

    svg.selectAll("rect")
      .data(correlations)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.a))
      .attr("y", d => yScale(d.b))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.correlation));

    svg.selectAll("text")
      .data(correlations)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.a))
      .attr("y", d => yScale(d.b))
      .attr("dy", "1em")  // Adjust position within cell
      .attr("dx", "0.5em") // Adjust position within cell
      .text(d => d.correlation.toFixed(2))
      .attr("fill", d => Math.abs(d.correlation) > 0.6 ? "white" : "black");
  
  }, [correlations]);
  

  return (
    <div>
      <h1>Correlation heatmap</h1>
      {/* Implement your D3.js Plotting code here */}
      <svg ref={svgRef} width={1000} height={1000}></svg>
    </div>
  );
};

export default CorrelationHeatmap;

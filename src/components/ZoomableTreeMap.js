import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const ZoomableTreemap = ({ width = 960, height = 570 }) => {
    const ref = useRef();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Load and process data
        d3.csv("../data/dataset.csv").then(rawData => {
            const nestedData = d3.rollup(
                rawData,
                v => v.length, // Use the number of songs as the "value" for each leaf node
                d => d.artist,
                d => d.song,
                d => d.genre
            )

            const hierarchyData = {
                name: "Artists",
                children: Array.from(nestedData, ([artist, songs]) => ({
                    name: artist,
                    children: Array.from(songs, ([song, genres]) => ({
                        name: song,
                        value: genres,
                        children: Array.from(genres, ([genre, value]) => ({
                            name: genre,
                            value: value
                        }))
                    }))
                }))
            };

            setData(hierarchyData);
            console.log("Raw CSV Data:", rawData);
            console.log("Processed Hierarchy:", hierarchyData);
            })
        .catch(error => {
            console.error("Error loading or processing data:", error);
        });
    }, []);
    

    useEffect(() => {
        if (!data) return; // Important: Do not attempt to render treemap if data is not available
        
        const svg = d3.select(ref.current)
            .attr("viewBox", [0, 0, width, height])
            .style("font", "10px sans-serif");

        const treemap = data => d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true)
            (d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value));

        const root = treemap(data);

        let group = svg.append("g")
            .selectAll("g")
            .data(root.children.concat(root))
            .join("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        group.append("title")
            .text(d => `${d.ancestors().map(d => d.name).reverse().join("/")}\n${d.value}`);

        group.append("rect")
            .attr("id", d => (d.leafUid = `OBS_ID_${d.data.name}`))
            .attr("fill", d => d.leaf ? d3.scaleOrdinal(d3.schemeCategory10)(d.depth) : "none")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("stroke", "white")
            .on("click", clicked);

        group.filter(d => d.leaf)
            .append("clipPath")
            .attr("id", d => (d.clipUid = `OBS_ID_${d.data.name}`))
            .append("use")
            .attr("xlink:href", d => `#${d.leafUid}`);

        group.filter(d => d.leaf)
            .append("text")
            .attr("clip-path", d => `url(#${d.clipUid})`)
            .selectAll("tspan")
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(d.value))
            .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${1 + i * 10}px`)
            .text(d => d);

        function clicked(event, p) {
            root.each(d => d.target = {
                x0: (d.x0 - p.x0) / (p.x1 - p.x0) * width,
                y0: (d.y0 - p.y0) / (p.y1 - p.y0) * height,
                x1: (d.x1 - p.x0) / (p.x1 - p.x0) * width,
                y1: (d.y1 - p.y0) / (p.y1 - p.y0) * height
            });

            const t = svg.transition().duration(750);

            group.transition(t)
                .attr("transform", d => `translate(${d.target.x0},${d.target.y0})`);

            group.select("rect").transition(t)
                .attr("width", d => d.target.x1 - d.target.x0)
                .attr("height", d => d.target.y1 - d.target.y0);

            group.select("text").transition(t)
                .attr("fill-opacity", d => +labelVisible(d.target));

            group.filter(d => d.leaf).select("text").selectAll("tspan").transition(t)
                .attr("x", 3)
                .attr("y", (d, i, nodes) => `${1 + i * 10}px`)
                .text(d => d);
        }

        function labelVisible(d) {
            return d.y1 <= height && d.y0 >= 0 && d.x1 <= width && d.x0 >= 0;
        }
    }, [data, width, height]);
    

    if (!data) return "Loading..."; // Show a loading message until the data is processed
    return <svg ref={ref} />;
};

export default ZoomableTreemap;

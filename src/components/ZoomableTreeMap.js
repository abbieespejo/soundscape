import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import data from "../data/output_file.json";
import { v4 as uuidv4 } from 'uuid';
import "./ZoomableTreeMap.css";


const ZoomableTreemap = ({ width = 2000, height = 850, padding = 20 }) => {
    const ref = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (!data) return;
        /** Custom tiling function adapts the built-in binary tiling function
         * for the appropriate aspect ratio when the treemap is zoomed-in. */
        function tile(node, x0, y0, x1, y1) {
            d3.treemapBinary(node, 0, 0, width, height);
            for (const child of node.children) {
                child.x0 = x0 + child.x0 / width * (x1 - x0);
                child.x1 = x0 + child.x1 / width * (x1 - x0);
                child.y0 = y0 + child.y0 / height * (y1 - y0);
                child.y1 = y0 + child.y1 / height * (y1 - y0);
            }
        }

        const hierarchy = d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        const root = d3.treemap().tile(tile)(hierarchy);
        console.log("Treemap Root:", root);
        console.log("Hierarchy:", hierarchy);

        const viewBox = [
            -padding / 2, // left padding
            -30.5 - padding / 2, // top padding (including your existing -30.5 offset)
            width + padding, // width + right padding
            height + 30 + padding // height + bottom padding (including your existing 30 offset)
        ];

        // Create the scales.
        const x = d3.scaleLinear().rangeRound([padding, width - padding]);
        const y = d3.scaleLinear().rangeRound([padding, height - padding]);

        const format = d3.format(",d");
        const name = d => {
            if (d.depth === 0) {
                return "Artists";
            }
            return d.ancestors().reverse().map(d => d.data.name).join("/");
        };
        const tooltip = d3.select(tooltipRef.current)
            .style("opacity", 0); // Start with the tooltip hidden

        function mouseover(event, d) {
            console.log("Mouseover event triggered for", d);
            tooltip.transition().duration(200).style("opacity", 1); // Show the tooltip
            tooltip.html(`Name: ${name(d)}<br>Popularity Score: ${format(d.value)}`)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY + 5}px`);
        }

        function mouseout() {
            console.log("Mouseout event triggered");
            tooltip.transition().duration(500).style("opacity", 0); // Hide the tooltip
        }

        const svg = d3.select(ref.current)
        .attr("viewBox", viewBox.join(" "))
            .attr("width", width)
            .attr("height", height + 30)
            .attr("style", "max-width: 100%; height: auto;")
            .style("font", "10px sans-serif");

        let group = svg.append("g")
            .call(render, root);

        function render(group, root) {
            const node = group
                .selectAll("g")
                .data(root.children.concat(root))
                .join("g");

            node.filter(d => d === root ? d.parent : d.children)
                .attr("cursor", "pointer")
                .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

                node.append("rect")
                .attr("id", d => d.leafUid = `leaf_${uuidv4()}`)
                .attr("fill", d => d === root ? "#fff" : d.children ? "#ccc" : "#ddd")
                .attr("stroke", "#fff")
                .on("mouseover", mouseover)  // Add the mouseover event listener
                .on("mouseout", mouseout);   // Add the mouseout event listener

            node.append("clipPath")
                .attr("id", d => d.clipUid = `clip_${uuidv4()}`)
                .append("use")
                .attr("xlink:href", d => `#${d.leafUid}`);

            node.append("text")
                .attr("clip-path", d => `url(#${d.clipUid})`)
                .attr("font-weight", d => d === root ? "bold" : null)
                .selectAll("tspan")
                .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
                .join("tspan")
                .attr("x", 3)
                .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
                .text(d => d);

            group.call(position, root);
        }


        function position(group, root) {
            group.selectAll("g")
                .attr("transform", d => d === root ? `translate(${padding / 2},${padding / 2 - 30})` : `translate(${x(d.x0)},${y(d.y0)})`)
                .select("rect")
                .attr("width", d => d === root ? width - padding : x(d.x1) - x(d.x0))
                .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
        }

        // When zooming in, draw the new nodes on top, and fade them in.
        function zoomin(d) {
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.append("g").call(render, d);

            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);

            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                    .call(position, d.parent))
                .call(t => group1.transition(t)
                    .attrTween("opacity", () => d3.interpolate(0, 1))
                    .call(position, d));
        }

        // When zooming out, draw the old nodes on top, and fade them out.
        function zoomout(d) {
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.insert("g", "*").call(render, d.parent);

            x.domain([d.parent.x0, d.parent.x1]);
            y.domain([d.parent.y0, d.parent.y1]);

            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                    .attrTween("opacity", () => d3.interpolate(1, 0))
                    .call(position, d))
                .call(t => group1.transition(t)
                    .call(position, d.parent));
        }
        tooltip.style("opacity", 1).html("Test tooltip").style("left", "10px").style("top", "10px");
    }, []);
    
    return (
        <>
            <svg ref={ref} width={width} height={height + 30} />
            {/* Add this div for the tooltip */}
            <div ref={tooltipRef} className="tooltip" />
        </>
    );
};
export default ZoomableTreemap;
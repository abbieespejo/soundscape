import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataset from "../data/dataset.csv";

const MultiSeriesLineChart = () => {
  const [data, setData] = useState([]);
  const [selectedCharacteristic, setSelectedCharacteristic] =
    useState("duration_ms");
  const [averagedData, setAveragedData] = useState({});

  // data manipulation

  // for the genres edm, latin, pop, hip-hop, rock, and r&b, we need to find
  // the average duration_ms, popularity, danceability, energy, key, loudness,
  // speechiness, acousticness, instrumentalness, liveness, valence, tempo for
  // each year spanning 1999-2019

  // retrieve all songs for a certain genre by looking at the genre value of data entry (e.g. all pop songs)

  // retrieve the selected audio characteristic value for all songs under the genre

  // with these values, calculate the average (sum of terms / number of terms) for each year by looking at the 'year' field

  const calculateAverage = (data) => {
    const selectedCharacteristic = 'duration_ms'; // Hardcoded value
    const genres = [
      "Dance/Electronic",
      "latin",
      "pop",
      "hip hop",
      "rock",
      "R&B",
    ];
    
    // Retrieve unique years and sort them
    const years = Array.from(new Set(data.map((d) => +d.year))).sort((a, b) => a - b);
  
    const avgData = {};
  
    years.forEach((year) => {
      avgData[year] = {};  // Initialize an empty object for each year
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
        avgData[year][genre] = avg;  // Store the average value for each genre under the corresponding year
      });
    });
  
    console.log("Averaged Data:", avgData);
  };
  
  useEffect(() => {
    // Read and parse the CSV data
    d3.csv(dataset).then((fetchedData) => {
      setData(fetchedData);
      // Calculate average for the initial characteristic
      calculateAverage(fetchedData);
    });
  }, []);
  

  return (
    <div>
      <select onChange={(e) => setSelectedCharacteristic(e.target.value)}>
        <option value="duration_ms">Duration</option>
        <option value="popularity">Popularity</option>
        {/* Add other options here */}
      </select>
      {/* Here, you can use D3 to render your multi-series line chart based on `averagedData` */}
    </div>
  );
};

export default MultiSeriesLineChart;

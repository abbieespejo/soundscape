import React, { useState, useEffect } from "react";
import Bar from "./Bar";
import "./BarChart.css";

const classes = {
  container: {
    width: "100%",
  },
  barChart: {
    display: "flex",
    justifyContent: "center"

  }
};

const BarChart = ({
  data,
  barStyle,
  maxItems: propsMaxItems,
  timeline,
  timeout,
  colors,
  labels,
  timelineStyle,
  textBoxStyle,
  width,
  startYear,
  endYear,
}) => {
  const barHeight = `calc(${barStyle.height} + ${barStyle.marginTop})`;
  const nItems = Object.keys(data).length;
  const maxItems = propsMaxItems <= nItems ? propsMaxItems : nItems;
  const barChartStyle = {
    height: `calc(${maxItems} * ${barHeight})`,
  };
  const [currentYear, setCurrentYear] = useState(startYear);
  const [idx, setIdx] = useState(0);
  const [prevRank, setPrevRank] = useState({});
  const [currRank, setCurrRank] = useState({});
  const [maxVal, setMaxVal] = useState(0);

  useEffect(() => {
    const [newRank, newMaxVal] = sortAxis(idx);
    setPrevRank(currRank);
    setCurrRank(newRank);
    setMaxVal(newMaxVal);
  }, [idx]);

  // responds to changes in currentYear
  useEffect(() => {
    setIdx(currentYear - startYear);
  }, [currentYear]);

  const sortAxis = (i, descending = true) => {
    let toSort = Object.keys(data).map((name) => {
      return {
        name,
        val: data[name][i],
      };
    });

    toSort.sort((left, right) => left.val - right.val);
    if (descending) {
      toSort.reverse();
    }

    const fItems = Object.keys(data).length;
    if (maxItems && maxItems <= fItems) {
      toSort = toSort.slice(0, maxItems);
    }

    const maxValue = Math.max(...toSort.map((item) => item.val));
    const sortedRank = toSort.reduce(
      (ret, item, index) => ({
        ...ret,
        [item.name]: index,
      }),
      {}
    );

    return [sortedRank, maxValue];
  };

  const getInfoFromRank = (name) => {
    const currIdx = idx;
    const prevIdx = currIdx > 0 ? currIdx - 1 : 0;
    const value = data[name][currIdx];
    const isHidden = currRank[name] === undefined;
    const currStyle = {
      ...barStyle,
      marginTop: `calc(${currRank[name]} * ${barHeight})`,
      width: `${(100 * data[name][currIdx]) / maxVal}%`,
      backgroundColor:"#785ae6"
    };
    const prevStyle = {
      ...barStyle,
      marginTop: `calc(${prevRank[name]} * ${barHeight})`,
      width: `${(100 * data[name][prevIdx]) / maxVal}%`,
      backgroundColor: "#785ae6"
    };
    return [value, isHidden, currStyle, prevStyle];
  };

  return (
    <div style={classes.container}>
      <div style={timelineStyle}>
        {"Number of Popular Songs by Artist from 1999-2019"}
      </div>
      <div style={{ ...classes.barChart, ...barChartStyle }}>
        {Object.keys(data).map((name) => {
          const [value, hidden, currStyle, prevStyle] = getInfoFromRank(name);
          if (hidden) return null;
          return (
            <Bar
              key={name}
              name={name}
              value={value}
              label={labels[name]}
              currStyle={currStyle}
              prevStyle={prevStyle}
              timeout={timeout}
              textBoxStyle={textBoxStyle}
              width={width}
            />
          );
        })}
      </div>
      <div className="slider-container">
        <input
          type="range"
          min={startYear}
          max={endYear}
          value={currentYear}
          onChange={(e) => setCurrentYear(+e.target.value)}
          style={{ width: "80%" }}
        />
        <div style={{ marginTop: "10px" }}>{currentYear}</div>
      </div>
    </div>
  );
};

export default BarChart;

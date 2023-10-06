import React from "react";
import data from "../../data/processed_data_v2.json";
import BarChart from "./BarChart";
import "./BarChart.css";

const RacingBarChart = () => {
  const startYear = 1999;
  const endYear = 2019;
  const randomColor = () => {
    return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255})`;
  };

  const keys = Object.keys(data);
  const colors = keys.reduce(
    (res, item) => ({
      ...res,
      ...{ [item]: randomColor() },
    }),
    {}
  );

  const labels = keys.reduce((res, item, idx) => {
    return {
      ...res,
      ...{
        [item]: (
          <div style={{ textAlign: "center" }}>
            <div>{item}</div>
          </div>
        ),
      },
    };
  }, {});

  const time = Array.from(
    { length: endYear - startYear + 1 },
    (_, idx) => startYear + idx
  );

  return (
    <div className="bar-chart-container">
        <BarChart
          startYear={startYear}
          endYear={endYear}
          data={data}
          timeline={time}
          labels={labels}
          colors={colors}
          timeout={500}
          delay={1000}
          timelineStyle={{
            textAlign: "center",
            fontFamily: "GeneralSans-Medium",
            fontSize: "3em",
            color: "black",
            marginBottom: "1.5em",
          }}
          textBoxStyle={{
            paddingLeft: "2em",
            color: "#63727e",
            fontSize: "1.5em",
          }}
          barStyle={{
            height: "15px",
            marginTop: "25px",
            borderRadius: "10px",
          }}
          width={[10, 85, 5]}
          maxItems={10}
        />
      </div>
  );
};
export default RacingBarChart;

import React, { useState } from "react";
import "./App.css";
import CorrelationHeatmap from "./components/CorrelationHeatmap";
import HomeLanding from "./components/HomeLanding";
import NavBar from "./components/NavBar";
import MultiSeriesLineChart from "./components/MultiSeriesLineChart";
import AudioCharacteristics from "./components/AudioCharacteristics";
import RacingBarChart from "./components/BarChartRace/RacingBarChart";

const App = () => {
  return (
    <div>
      <NavBar />
      <div id="app-container">
        <HomeLanding />
        <RacingBarChart/>
        <AudioCharacteristics />
        {/* <CorrelationHeatmap /> */}
        {/* <MultiSeriesLineChart /> */}
        

      </div>
    </div>
  );
};

export default App;

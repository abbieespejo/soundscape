import React, { useState } from "react";
import { Element, scroller } from "react-scroll";
import { Box } from "@mui/material";
import "./App.css";
import CorrelationHeatmap from "./components/CorrelationHeatmap";
import HomeLanding from "./components/HomeLanding";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <div id="app-container">
        <HomeLanding />
        {/* <CorrelationHeatmap /> */}
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import "./HomeLanding.css";
import Lottie from "lottie-react";
import analysingInfographics from "../assets/analysing-inforgraphics.json"; // Adjust the path to your JSON file

const HomeLanding = ({ scrollToBarChart }) => {
  return (
    <div className="gradient-box">
      <div className="landing-box-wrapper">
        <div className="column1">
          <div id="column-1-contents">
            <h1 id="landing-box-h1">
              <span style={{ color: "#785ae6" }}>Discover</span> the trends that
              shape how we listen to{" "}
              <span style={{ color: "#785ae6" }}>music today</span>
            </h1>
            <p>
              Soundscape offers engaging, user-friendly visualisations that
              represent a rich dataset of the top Spotify tracks spanning the
              years 1999 to 2019.
            </p>
            <button id="landing-box-button" onClick={scrollToBarChart}>
              <span className="button-text">Get started</span>
            </button>
          </div>
        </div>
        <div className="column2">
          <Lottie animationData={analysingInfographics}></Lottie>
        </div>
      </div>
    </div>
  );
};

export default HomeLanding;

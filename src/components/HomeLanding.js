import React, { useState } from "react";
import "./HomeLanding.css";

const HomeLanding = () => {
  return (
    <div className="gradient-box">
      <div className="landing-box-wrapper">
        <div className="column1">
          <h1 id="landing-box-h1">Soundscape.</h1>
        </div>
        <div className="column2">
          <p>
          Interactively explore key audio statistics from Spotify's top 2,000 tracks from 1999 to 2019. Dive into the data and discover the trends that shape how we listen to music today.
          </p>
          <div className="decorative-line"></div>
          <button id="landing-box-button"><span className="button-text">Get started</span></button>
        </div>
      </div>
    </div>
  );
};

export default HomeLanding;

import React, { useState } from "react";
import "./AudioCharacteristics.css";
import Lottie from "lottie-react";
import InfoCard from "./InfoCard";

const AudioCharacteristics = () => {
    return (
        <div id="ac-main-div">
            <div className="wrapper">
                <div className="column1">
                    <div id="ac-contents">
                        <h1 id="audio-characteristics-h1">
                            Understanding the characteristics of a song
                        </h1>
                        <p id="audio-characteristics-blurb">
                            Using Spotify’s Web API, developers have access to a wealth of metadata detailing various attributes for every song.
                            Soundscape integrates this rich, complex metadata from a dataset file that contains the top Spotify songs from 1999 to 2019.
                        </p>
                        <InfoCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioCharacteristics;

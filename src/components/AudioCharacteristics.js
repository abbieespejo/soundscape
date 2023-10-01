import React, { useState } from "react";
import "./AudioCharacteristics.css";
import Card from "./Card";
import energyIcon from "../assets/thunderbolt.png";
import danceabilityIcon from "../assets/danceability.png";
import durationIcon from "../assets/duration.png";
import instrumentalnessIcon from "../assets/instrumentalness.png";
import popularityIcon from "../assets/popularity.png";
import valenceIcon from "../assets/valence.png";
import loudnessIcon from "../assets/loudness.png";
import tempoIcon from "../assets/tempo.png";

const AudioCharacteristics = () => {
  return (
    <div id="ac-main-div">
        <h1 id="audio-characteristics-h1">
          Understanding the characteristics of a song
        </h1>
        <p id="audio-characteristics-blurb">
          Using Spotify’s Web API, developers have access to a wealth of
          metadata detailing various attributes for every song. Soundscape
          integrates this rich, complex metadata from a dataset file that
          contains the top Spotify songs from 1999 to 2019.
        </p>
        <div id="cards-wrapper">
          <Card
            label="Duration"
            icon={durationIcon}
            description="Duration of a song in milliseconds."
          />
          <Card
            label="Danceability"
            icon={danceabilityIcon}
            description="Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
          />
          <Card
            label="Energy"
            icon={energyIcon}
            description="Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. "
          />
          <Card
            label="Popularity"
            icon={popularityIcon}
            description="The popularity of a track is a value between 0 and 100, with 100 being the most popular."
          />
          <Card
            label="Instrumentalness"
            icon={instrumentalnessIcon}
            description="Predicts whether a track contains no vocals."
          />
          <Card
            label="Valence"
            icon={valenceIcon}
            description="A measure that describes the musical postiveness conveyed by a song."
          />
          <Card
            label="Tempo"
            icon={tempoIcon}
            description="The overall estimated tempo of a track in beats per minute (BPM)."
          />
          <Card
            label="Loudness"
            icon={loudnessIcon}
            description="The overall loudness of a track in decibels (dB)."
          />
        </div>
      </div>
  );
};

export default AudioCharacteristics;

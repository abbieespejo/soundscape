// InfoCard.js
import React from 'react';

import Card from './Card'; // Adjust the import as per your file structure
import energyIcon from '../assets/thunderbolt.png';
import danceabilityIcon from '../assets/danceability.png';
import durationIcon from '../assets/duration.png';
import instrumentalnessIcon from '../assets/instrumentalness.png';
import popularityIcon from '../assets/popularity.png';
import valenceIcon from '../assets/valence.png';
import loudnessIcon from '../assets/loudness.png';
import tempoIcon from '../assets/tempo.png';

function InfoCard() {
  return (
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
        description="The popularity of a track is a value between 0 and 100, with 100 being the most popular. The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are." 
      />
      <Card 
        label="Instrumentalness" 
        icon={instrumentalnessIcon} 
        description="Predicts whether a track contains no vocals." 
      />
      <Card 
        label="Valence" 
        icon={valenceIcon} 
        description="A measure that describes the musical postiveness conveyed by a song. Tracks with high valence sound more positive, while tracks with low valence sound more negative."
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
  );
}

export default InfoCard;

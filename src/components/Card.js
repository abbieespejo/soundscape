// Card.js
import React, { useState } from 'react';
import infoIcon from '../assets/information.png';
import './InfoCard.css';

function Card({ label, icon, description }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDescription = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className="card">
      <img className="characteristic-icon" src={icon} />
      <div className="info-container" onClick={toggleDescription}>
        <span className="label">{label}</span>
        <span className="icon">
          <img id="info-icon" src={infoIcon} alt="Info Icon" />
        </span>
      </div>
      {isVisible && <p className="description">{description}</p>}
    </div>
  );
}

export default Card;

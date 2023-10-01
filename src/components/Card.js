// Card.js
import React, { useState } from 'react';
import infoIcon from '../assets/information.png';

function Card({ label, icon, description, hasInfoIcon = true, className }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleDescription = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className={`card ${className}`}>
      <img className="characteristic-icon" src={icon} alt={`${label} Icon`} />
      <div className="info-container" onClick={toggleDescription}>
        <span className="label">{label}</span>
        {hasInfoIcon && (
          <span className="icon">
            <img id="info-icon" src={infoIcon} alt="Info Icon" />
          </span>
        )}
      </div>
      {isVisible && <p className="description">{description}</p>}
    </div>
  );
}


export default Card;

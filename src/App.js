import React, { useState } from 'react';
import { Element, scroller } from 'react-scroll';
import { Box } from '@mui/material';
import './App.css';

const Section = ({ name }) => (
  <Element name={name} className="element full-vh">
    <h1>{name}</h1>
  </Element>
);

const DotNavigation = ({ sectionNames, activeSection, setActiveSection }) => {
  const handleClick = (section) => {
    scroller.scrollTo(section, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  };

  return (
    <Box className="dot-nav">
      {sectionNames.map((name, i) => (
        <div
          key={name}
          onClick={() => handleClick(name)}
          className={`dot ${activeSection === i ? 'active' : ''}`}
        />
      ))}
    </Box>
  );
};

const App = () => {
  const sectionNames = ['Section', 'Section 2', 'Section 3'];
  const [activeSection, setActiveSection] = useState(0);

  const onScroll = (e) => {
    const scrollPosition = e.currentTarget.scrollTop;
    const currentIndex = Math.round(scrollPosition / window.innerHeight);
    setActiveSection(currentIndex);
  };

  return (
    <div className="App" onScroll={onScroll}>
      <DotNavigation
        sectionNames={sectionNames}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {sectionNames.map((name) => (
        <Section key={name} name={name} />
      ))}
    </div>
  );
};

export default App;

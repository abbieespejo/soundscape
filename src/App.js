import React, { useState } from 'react';
import { Element, scroller } from 'react-scroll';
import { Box } from '@mui/material';
import './App.css';
import CorrelationHeatmap from './components/CorrelationHeatmap';
import HomeLanding from './components/HomeLanding';

const App = () => {

  return (
    <div id='app-container'>
      <HomeLanding />
      {/* <CorrelationHeatmap /> */}
    </div>
    
  );
};

export default App;

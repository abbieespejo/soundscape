import "./App.css";
import { useRef } from 'react';
import CorrelationHeatmap from "./components/CorrelationHeatmap";
import HomeLanding from "./components/HomeLanding";
import NavBar from "./components/NavBar";
import MultiSeriesLineChart from "./components/MultiSeriesLineChart";
import AudioCharacteristics from "./components/AudioCharacteristics";
import ZoomableTreemap from "./components/ZoomableTreeMap";
import RacingBarChart from "./components/BarChartRace/RacingBarChart";

const App = () => {
  const barChartRef = useRef(null); // Create a ref for the component

  const scrollToBarChart = () => {
    barChartRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div>
      <NavBar />
      <div id="app-container">
      <HomeLanding scrollToBarChart={scrollToBarChart} /> {/* Pass the scrolling function as a prop */}
        <RacingBarChart ref={barChartRef} />
        {/* <RacingBarChart/> */}
        <AudioCharacteristics />
        <ZoomableTreemap />
        <CorrelationHeatmap />
        <MultiSeriesLineChart />
        

      </div>
    </div>
  );
};

export default App;

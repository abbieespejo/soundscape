import "./App.css";
import CorrelationHeatmap from "./components/CorrelationHeatmap";
import HomeLanding from "./components/HomeLanding";
import NavBar from "./components/NavBar";
import MultiSeriesLineChart from "./components/MultiSeriesLineChart";
import AudioCharacteristics from "./components/AudioCharacteristics";
import ZoomableTreemap from "./components/ZoomableTreeMap";
import RacingBarChart from "./components/BarChartRace/RacingBarChart";

const App = () => {
  return (
    <div>
      <NavBar />
      <div id="app-container">
        <HomeLanding />
        <RacingBarChart/>
        <AudioCharacteristics />
        <ZoomableTreemap />
        {/* <CorrelationHeatmap /> */}
        <MultiSeriesLineChart />
        

      </div>
    </div>
  );
};

export default App;

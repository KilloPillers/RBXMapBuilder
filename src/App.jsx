import React from "react";
import { useState } from "react";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import emptyMap from "./testMap";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState(emptyMap);
  const updateMap = (newMapData) => {
    setMapData(newMapData);
  }

  const [selectedCubes, setSelectedCubes] = useState([]);

  return (
    <div className="app">
      <div className="scene">
        <MapScene mapData={mapData} selectedCubes={selectedCubes} setSelectedCubes={setSelectedCubes}/>
      </div>
      <Overlay mapData={mapData} updateMap={updateMap} selectedCubes={selectedCubes}/>
    </div> 
  );
}

export default App;

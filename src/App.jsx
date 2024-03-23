import React from "react";
import { useState } from "react";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import "./App.css";

 const emptyMap = {
    width: 10,
    height: 10,
    ButtonGrid: "empty"
};

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
      <Overlay mapData={mapData} updateMap={updateMap}/>
    </div> 
  );
}

export default App;

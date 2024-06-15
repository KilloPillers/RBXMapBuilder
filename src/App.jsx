import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { MyContext } from "./MyContext";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import emptyMap from "./testMap";
import c3 from "./c3";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState(c3);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const updateMap = (newMapData) => {
    setMapData(newMapData);
  }

  const [selectedCubes, setSelectedCubes] = useState([]);

  return (
    <MyContext.Provider value={{ mapData, updateMap, selectedCubes, setSelectedCubes, drawerOpen, setDrawerOpen }}>
      <div className="app">
        <div className="scene">
          <MapScene/>
        </div>
        <Overlay/> 
      </div> 
    </MyContext.Provider>
  );
}

export default App;

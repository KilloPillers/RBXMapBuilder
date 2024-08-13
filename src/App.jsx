import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { MyContext } from "./MyContext";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import { useEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import emptyMap from "./testMap";
import c3 from "./c3";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState(c3);
  const [mapDataCopy, setMapDataCopy] = useState(c3);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [selectedCubes, setSelectedCubes] = useState([]);
  const unitModelRef = React.useRef();
  const [tool, setTool] = React.useState("inspect");
  const [inspectedTile, setInspectedTile] = React.useState(null);

  const updateMap = (newMapData) => {
    setMapData(newMapData);
  };

  useEffect(() => {
    // Load the unit model
    const loader = new OBJLoader();
    loader.load("/models/rbxdefaultmodel.obj", function (object) {
      // Create a group to add to the model to
      const modelGroup = new THREE.Group();
      modelGroup.add(object);

      // Apply initial scale and rotation to the model
      modelGroup.scale.set(0.25, 0.25, 0.25);
      modelGroup.rotation.y = Math.PI / 2;
      unitModelRef.current = modelGroup;
      console.log("Unit model loaded");
    });

    setIsModelsLoaded(true);
  }, []);

  return (
    <MyContext.Provider
      value={{
        mapData,
        setMapData,
        mapDataCopy,
        setMapDataCopy,
        selectedCubes,
        setSelectedCubes,
        drawerOpen,
        setDrawerOpen,
        isModelsLoaded,
        unitModelRef,
        tool,
        setTool,
        inspectedTile,
        setInspectedTile,
      }}
    >
      <div className="app">
        <div className="scene">
          <MapScene />
        </div>
        <Overlay />
      </div>
    </MyContext.Provider>
  );
}

export default App;

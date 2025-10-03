import React from "react";
import { useState } from "react";
import { MyContext } from "./MyContext";
import MapScene from "./Scene.jsx";
import Overlay from "./Overlay.jsx";
import { useEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import * as THREE from "three";
import c3 from "./c3";
import "./App.css";

function App() {
  const [mapData, setMapData] = useState(c3);
  const [mapDataCopy, setMapDataCopy] = useState(
    JSON.parse(JSON.stringify(mapData)),
  );
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
    /*
    const OBJFileURL = "/models/rbxdefaultmodel.obj";

    const checkFileExists = async (url) => {
      console.log("Checking file exists:", url);
      try {
        const response = await fetch(url);
        if (
          response.ok &&
          response.headers.get("Content-Type").includes("model/obj")
        ) {
          return true; // File exists and is of the correct type
        } else {
          console.error("File not found or is not a valid OBJ file.");
          return false;
        }
      } catch (error) {
        console.error("Error checking file:", error);
        return false;
      }
    };
    */

    const loadModel = async () => {
      const modelPath = "/models/rbxdefaultmodel.obj";

      // Load the unit model
      const loader = new OBJLoader();
      // Try to load the model
      loader.load(
        modelPath,
        function (object) {
          // Check if the object is a valid OBJ file
          if (object instanceof THREE.Group) {
            // Create a group to add to the model to
            const modelGroup = new THREE.Group();
            modelGroup.add(object);

            // Apply initial scale and rotation to the model
            modelGroup.scale.set(0.25, 0.25, 0.25);
            modelGroup.rotation.y = Math.PI / 2;
            unitModelRef.current = modelGroup;
            console.log("Unit model loaded");

            setIsModelsLoaded(true);
          } else {
            console.error("Model is not an instance of THREE.Group");
            setIsModelsLoaded(false);
          }
        },
        undefined,
        function (error) {
          console.error(error);
          setIsModelsLoaded(false);
        },
      );
    };

    loadModel();
  }, []);

  return (
    <MyContext.Provider
      value={{
        mapData,
        updateMap,
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

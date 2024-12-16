import React, {
  useRef,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import * as THREE from "three";
import Tile from "./Models/Tile";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { MyContext } from "./MyContext";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const BLOOM_SCENE = 1;

function MapScene() {
  const {
    mapData,
    updateMap,
    mapDataCopy,
    setMapDataCopy,
    selectedCubes,
    setSelectedCubes,
    drawerOpen,
    isModelsLoaded,
    unitModelRef,
    tool,
    inspectedTile,
    setInspectedTile,
  } = useContext(MyContext);
  const containerRef = useRef();
  const controlsRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const cubesRef = useRef([]);

  // Create a raycaster and mouse vector
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Create a color to use when selecting objects
  const colorSelected = new THREE.Color(0xff0000); // Red
  const target = new THREE.Vector3(0, 0, 0); // Target to rotate around

  // Create vectors to store camera position when mouse is down and up
  var cameraPositionOnButtonDown = new THREE.Vector3();
  var cameraPositionOnButtonUp = new THREE.Vector3();

  const cubes = [];

  const moveTileGroup = (direction) => {
    // Down means y decreases, up means y increases
    // Left means x decreases, right means x increases
    // Get the camera direction
    const cameraDirection = new THREE.Vector3();
    cameraRef.current.getWorldDirection(cameraDirection);
    // Normalize the camera direction
    cameraDirection.normalize();

    // Figure out which direction to move the tiles based on the camera direction
    // Magnitude of the camera direction vector
    // If the camera direction is mostly in the x direction
    if (Math.abs(cameraDirection.x) > Math.abs(cameraDirection.z)) {
      if (cameraDirection.x > 0) {
        if (direction === "left") {
          direction = "up";
        } else if (direction === "right") {
          direction = "down";
        } else if (direction === "up") {
          direction = "right";
        } else if (direction === "down") {
          direction = "left";
        }
      } else {
        if (direction === "left") {
          direction = "down";
        } else if (direction === "right") {
          direction = "up";
        } else if (direction === "up") {
          direction = "left";
        } else if (direction === "down") {
          direction = "right";
        }
      }
    }
    // If the camera direction is mostly in the z direction
    else {
      if (cameraDirection.z > 0) {
        if (direction === "up") {
          direction = "down";
        } else if (direction === "down") {
          direction = "up";
        } else {
          if (direction === "left") {
            direction = "right";
          } else if (direction === "right") {
            direction = "left";
          }
        }
      }
    }

    // Check to see if no selected cube is on the edge
    for (let cube of selectedCubes) {
      if (direction === "up" && cube.tileJSON.tile_position[1] === 0) {
        return;
      }
      if (
        direction === "down" &&
        cube.tileJSON.tile_position[1] === mapData.height - 1
      ) {
        return;
      }
      if (direction === "left" && cube.tileJSON.tile_position[0] === 0) {
        return;
      }
      if (
        direction === "right" &&
        cube.tileJSON.tile_position[0] === mapData.width - 1
      ) {
        return;
      }
    }

    // To make sure that the cubes do not override each other, we need to sort them by their position depending on the direction
    if (direction === "up") {
      selectedCubes.sort((a, b) => {
        return a.tileJSON.tile_position[1] - b.tileJSON.tile_position[1];
      });
    } else if (direction === "down") {
      selectedCubes.sort((a, b) => {
        return b.tileJSON.tile_position[1] - a.tileJSON.tile_position[1];
      });
    } else if (direction === "left") {
      selectedCubes.sort((a, b) => {
        return a.tileJSON.tile_position[0] - b.tileJSON.tile_position[0];
      });
    } else if (direction === "right") {
      selectedCubes.sort((a, b) => {
        return b.tileJSON.tile_position[0] - a.tileJSON.tile_position[0];
      });
    }

    // Move the selected cubes in the direction
    for (let cube of selectedCubes) {
      // In the code below, x and y are inverted from the way they are stored in the map data.
      // and the way they where instantiated in the scene
      let swapCube = null;
      if (direction === "up") {
        // Find the cube that is going to be swapped with
        const x = cube.tileJSON.tile_position[0];
        const y = cube.tileJSON.tile_position[1] - 1;
        swapCube = cubesRef.current[x * mapData.height + y];
      } else if (direction === "down") {
        // Find the cube that is going to be swapped with
        const x = cube.tileJSON.tile_position[0];
        const y = cube.tileJSON.tile_position[1] + 1;
        swapCube = cubesRef.current[x * mapData.height + y];
      } else if (direction === "left") {
        // Find the cube that is going to be swapped with
        const x = cube.tileJSON.tile_position[0] - 1;
        const y = cube.tileJSON.tile_position[1];
        swapCube = cubesRef.current[x * mapData.height + y];
      } else if (direction === "right") {
        // Find the cube that is going to be swapped with
        const x = cube.tileJSON.tile_position[0] + 1;
        const y = cube.tileJSON.tile_position[1];
        swapCube = cubesRef.current[x * mapData.height + y];
      }
      // cube = the cube that is going to be moved
      // swapCube = the cube that is going to be swapped with
      //  cube -> swapCube
      //  A   ->    B


      // Perform swap
      swapCube.is_selected = true;
      swapCube.swapTileJSON(cube.tileJSON);
      // Replace the cube tileJSON with the old tileJSON from mapDataCopy
      cube.is_selected = false;
      const cubeTile = mapDataCopy.ButtonGrid[cube.tileJSON.tile_position[0]][cube.tileJSON.tile_position[1]];
      cube.swapTileJSON(cubeTile);

      // Remove the cube from the selected cubes
      setSelectedCubes((prevSelectedCubes) =>
        prevSelectedCubes.filter((selectedCube) => selectedCube !== cube)
      );
      // Add the swap cube to the selected cubes
      setSelectedCubes((prevSelectedCubes) => [...prevSelectedCubes, swapCube]);
    }
  };

  // Add arrow key event listener
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowUp") {
        moveTileGroup("up");
      }
      if (event.key === "ArrowDown") {
        moveTileGroup("down");
      }
      if (event.key === "ArrowLeft") {
        moveTileGroup("left");
      }
      if (event.key === "ArrowRight") {
        moveTileGroup("right");
      }
      if (event.key === "Escape") {
        for (let cube of selectedCubes) {
          // Update the mapDataCopy to reflect the change
          // Find the tile in the mapDataCopy and update it
          const x = cube.tileJSON.tile_position[0];
          const y = cube.tileJSON.tile_position[1];
          mapDataCopy.ButtonGrid[x][y] = cube.tileJSON;
          // Deselect cube
          cube.is_selected = false;
          cube.updateColor();
          cube.layers.disable(BLOOM_SCENE);
        }
        // Update the MapDataCopy
        const newMapDataCopy = JSON.parse(JSON.stringify(mapDataCopy)); // Deep copy
        setMapDataCopy(newMapDataCopy);
        // Deselect the selected cubes
        setSelectedCubes([]);
        // Deselect the inspected tile
        if (inspectedTile) {
          inspectedTile.is_inspected = false;
          inspectedTile.updateColor();
          inspectedTile.layers.disable(BLOOM_SCENE);
          setInspectedTile(null);
        }
      }
      // On spacebar press, show debug info
      //if (event.key === " ") {
        //console.log("Selected Cubes: ", selectedCubes);
        //console.log("Inspected Tile: ", inspectedTile);
      //}
    },
    [selectedCubes, mapDataCopy, inspectedTile, moveTileGroup]
  );

  // Add Click event listener to window
  const onCanvasClick = useCallback(
    (event) => {
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x =
        ((event.clientX - rendererRef.current.domElement.offsetLeft) /
          rendererRef.current.domElement.width) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - rendererRef.current.domElement.offsetTop) /
          rendererRef.current.domElement.height
        ) *
          2 +
        1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, cameraRef.current);
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(
        sceneRef.current.children,
        true
      );

      // Filter so we only get the Tile objects
      let tileIntersects = intersects.filter((intersect) => {
        return intersect.object.userData.tile instanceof Tile;
      });

      if (tileIntersects.length > 0) {
        const selectedObject = tileIntersects[0].object.userData.tile;
        if (event.type === "mousedown") {
          cameraPositionOnButtonDown = cameraRef.current.position.clone();
        }
        if (event.type === "mouseup") {
          cameraPositionOnButtonUp = cameraRef.current.position.clone();
        }
        if (!cameraPositionOnButtonDown.equals(cameraPositionOnButtonUp)) {
          return;
        }
        if (event.type === "mouseup") {
          if (tool === "inspect") {
            // Check if the tile is already inspected
            if (inspectedTile === selectedObject) {
              setInspectedTile(null);
              selectedObject.is_inspected = false;
              selectedObject.updateColor();
              if (selectedObject !== inspectedTile) {
              }
            } else {
              if (inspectedTile) {
                inspectedTile.is_inspected = false;
                inspectedTile.updateColor();
              }
              setInspectedTile(selectedObject);
              selectedObject.is_inspected = true;
              selectedObject.updateColor();
            }
            selectedObject.updateColor();
          }

          if (tool === "select") {
            setSelectedCubes((prevSelectedCubes) => {
              if (prevSelectedCubes.includes(selectedObject)) {
                selectedObject.is_selected = false;
                selectedObject.updateColor();
                // Update the MapDataCopy to reflect the change
                // Find the tile in the mapDataCopy and update it
                const x = selectedObject.tileJSON.tile_position[0];
                const y = selectedObject.tileJSON.tile_position[1];
                mapDataCopy.ButtonGrid[x][y] = selectedObject.tileJSON;
                const newMapDataCopy = JSON.parse(JSON.stringify(mapDataCopy)); // Deep copy 
                setMapDataCopy(newMapDataCopy);
                // Disable bloom for the tile if it is not the inspected tile
                if (inspectedTile !== selectedObject) {
                  tileIntersects[0].object.layers.disable(BLOOM_SCENE);
                }
                return prevSelectedCubes.filter(
                  (cube) => cube !== selectedObject
                );
              } else {
                selectedObject.is_selected = true;
                selectedObject.updateColor();
                return [...prevSelectedCubes, selectedObject];
              }
            });
          }
          cameraPositionOnButtonDown = new THREE.Vector3();
          cameraPositionOnButtonUp = new THREE.Vector3();
        }
      }
    },
    [tool, inspectedTile]
  );

  useEffect(() => {
    // Add event listeners
    window.addEventListener("mousedown", onCanvasClick);
    window.addEventListener("mouseup", onCanvasClick);
    return () => {
      // Clean up event listeners
      window.removeEventListener("mousedown", onCanvasClick);
      window.removeEventListener("mouseup", onCanvasClick);
    };
  }, [tool, inspectedTile]);

  useEffect(() => {
    // Add onKeyDown event listener
    window.addEventListener("keydown", onKeyDown);
    return () => {
      // Clean up event listeners
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Render pass for the entire scene without bloom
    const renderPass = new RenderPass(scene, camera);

    // Render pass for the bloom layer
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 0.2;
    bloomPass.radius = 0.1;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);

    bloomPass.renderToScreen = false;

    const mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D baseTexture;
          uniform sampler2D bloomTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
          }
        `,
      }),
      "baseTexture"
    );

    const outputPass = new OutputPass();
    bloomComposer.addPass(outputPass);

    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderPass);
    finalComposer.addPass(mixPass);
    finalComposer.addPass(outputPass);

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const materials = {};

    const nonBloom = (obj) => {
      if (obj.isMesh && bloomLayer.test(obj.layers) == false) {
        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;
      }
    };

    const restoreMaterial = (obj) => {
      if (materials[obj.uuid]) {
        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];
      }
    };

    // check if the render's DOM element is in the container
    const container = containerRef.current;
    if (!container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }

    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, half intensity
    directionalLight.position.set(0, 30, 0); // Positioned at an angle to the scene
    scene.add(directionalLight);

    // Add an ambient light for soft overall light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Also white light, half intensity
    scene.add(ambientLight);

    camera.position.z = -8;
    camera.position.y = 5;
    camera.position.x = -8;
    camera.lookAt(target);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
      LEFT: null,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.ROTATE,
    };

    controlsRef.current = controls;
    controls.target = target;

    const render = function () {
      scene.traverse(nonBloom);
      bloomComposer.render();
      scene.traverse(restoreMaterial);
      finalComposer.render();
      requestAnimationFrame(render);
    };

    const animate = function () {
      controls.update();
      render();
    };

    animate();

    // Adjust renderer size to fit the container
    const resizeRendererToDisplaySize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      finalComposer.setSize(window.innerWidth, window.innerHeight);
      bloomComposer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", resizeRendererToDisplaySize);
    window.addEventListener("mousedown", onCanvasClick);
    window.addEventListener("mouseup", onCanvasClick);

    return () => {
      // Remove the renderer's DOM element from the container
      const container = containerRef.current;
      const renderer = rendererRef.current;
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Clean up event listeners
      window.removeEventListener("resize", resizeRendererToDisplaySize);
      controls.dispose();
      renderer.dispose();
    };
  }, [isModelsLoaded]);

  useEffect(() => {
    // Remove the old cubes from the scene
    const disposeObject = (object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
      sceneRef.current.remove(object);
    };

    if (!isModelsLoaded) return;

    const scene = sceneRef.current;
    if (!scene) return;
    const width = mapData.width;
    const height = mapData.height;
    const map = mapData.ButtonGrid;

    if (!scene || !map) return;
    // Update the cube heights based on the map data
    cubesRef.current.forEach((cube) => scene.remove(cube.cube));
    cubesRef.current = [];
    const spacing = 1.0;

    if (mapData.ButtonGrid === "empty") {
      return;
    }

    for (let i = 0; i < width; i++) {
      // Width is the V
      for (let j = 0; j < height; j++) {
        // Height is ->
        // Create a cube
        const tileData = map[i][j];
        const cube = new Tile(tileData);
        cube.updatePosition(
          (i - Math.floor(width / 2)) * spacing,
          (j - Math.floor(height / 2)) * spacing
        );
        cube.updateHeight(tileData.tile_height);
        cube.updateColor();
        cube.unitModelRef = unitModelRef.current;
        if (tileData.has_unit) {
          cube.addUnit();
        }
        cubesRef.current.push(cube);
        scene.add(cube);
      }
    }

    // Size of the axis helper is the longest axis of the map
    const longAxis = Math.max(width, height);
    const axesHelper = new THREE.AxesHelper(longAxis + 3); //The size of the axes helper
    // The position of the axes helper
    // the axes helper is positioned at the [0,0] of the map grid
    axesHelper.position.set(
      Math.ceil(-width / 2) - spacing / 2,
      0,
      Math.ceil(-height / 2) - spacing / 2
    );
    scene.add(axesHelper);

    return () => {
      // Clean up the scene
      // Remove items from the selected cubes
      setSelectedCubes([]);
      // Remove the inspected tile
      setInspectedTile(null);
      // Remove the old cubes from the scene
      cubesRef.current.forEach((cube) => disposeObject(cube));
      cubesRef.current = [];
      // Remove the axes helper
      scene.remove(axesHelper);
    };
  }, [mapData, isModelsLoaded]); // <-- remove mapData from the dependency array when you're ready to implement the updateMap function

  return <div ref={containerRef} />;
}

export default MapScene;

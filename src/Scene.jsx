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

  const moveTileGroup = (selectedCubes, direction) => {
    // Down means y decreases, up means y increases
    // Left means x decreases, right means x increases

    // Get the camera direction
    const cameraDirection = new THREE.Vector3();
    cameraRef.current.getWorldDirection(cameraDirection);
    // Normalize the camera direction
    cameraDirection.normalize();
    // Log the camera direction
    console.log("Pressed Arrow Key: ", direction);
    console.log(cameraDirection);
    // Figure out which direction to move the tiles based on the camera direction
    // Magnitude of the camera direction vector
    // If the camera direction is mostly in the x direction
    if (Math.abs(cameraDirection.x) > Math.abs(cameraDirection.z)) {
      if (cameraDirection.x > 0) {
        if (direction === "left") {
          direction = "down";
        } else if (direction === "right") {
          direction = "up";
        } else if (direction === "up") {
          direction = "right";
        } else if (direction === "down") {
          direction = "left";
        }
      } else {
        if (direction === "left") {
          direction = "up";
        } else if (direction === "right") {
          direction = "down";
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
        if (direction === "left") {
          direction = "right";
        } else if (direction === "right") {
          direction = "left";
        } else if (direction === "up") {
          direction = "down";
        }
        if (direction === "down") {
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

    console.log("Translated Arrow Key: ", direction);

    // Move the selected cubes in the direction
    for (let cube of selectedCubes) {
      if (direction === "up") {
        cube.position.z += 10;
      } else if (direction === "down") {
        cube.position.z -= 10;
      } else if (direction === "left") {
        cube.position.x -= 10;
      } else if (direction === "right") {
        cube.position.x += 10;
      }
    }
  };

  // Add arrow key event listener
  const onKeyDown = useCallback(
    (event) => {
      console.log("Selected Cubes: ", selectedCubes);
      if (event.key === "ArrowUp") {
        moveTileGroup(selectedCubes, "up");
      }
      if (event.key === "ArrowDown") {
        moveTileGroup(selectedCubes, "down");
      }
      if (event.key === "ArrowLeft") {
        moveTileGroup(selectedCubes, "left");
      }
      if (event.key === "ArrowRight") {
        moveTileGroup(selectedCubes, "right");
      }
    },
    [selectedCubes]
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
              selectedObject.getMesh().layers.disable(BLOOM_SCENE);
              if (selectedObject !== inspectedTile) {
                selectedObject.getMesh().layers.disable(BLOOM_SCENE);
              }
            } else {
              if (inspectedTile) {
                inspectedTile.is_inspected = false;
                inspectedTile.getMesh().layers.disable(BLOOM_SCENE);
                inspectedTile.updateColor();
              }
              setInspectedTile(selectedObject);
              selectedObject.getMesh().layers.enable(BLOOM_SCENE);
              selectedObject.is_inspected = true;
            }
            selectedObject.updateColor();
          }

          if (tool === "select") {
            setSelectedCubes((prevSelectedCubes) => {
              if (prevSelectedCubes.includes(selectedObject)) {
                selectedObject.is_selected = false;
                selectedObject.updateColor();
                if (inspectedTile !== selectedObject) {
                  tileIntersects[0].object.layers.disable(BLOOM_SCENE);
                }
                return prevSelectedCubes.filter(
                  (cube) => cube !== selectedObject
                );
              } else {
                selectedObject.is_selected = true;
                tileIntersects[0].object.layers.enable(BLOOM_SCENE);
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
    window.addEventListener("keydown", onKeyDown);
    return () => {
      // Clean up event listeners
      window.removeEventListener("mousedown", onCanvasClick);
      window.removeEventListener("mouseup", onCanvasClick);
    };
  }, [tool, inspectedTile]);

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
  }, []);

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
      console.log("Empty map");
      return;
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Create a cube
        const tileData = map[i][j];
        const cube = new Tile(tileData);
        cube.updatePosition(
          (i - Math.floor(width / 2)) * spacing,
          (j - Math.floor(height / 2)) * spacing
        );
        cube.updateHeight(tileData.tile_height);
        cube.updateColor();
        if (tileData.has_unit) {
          cube.addUnit(unitModelRef.current);
        }
        cubesRef.current.push(cube);
        scene.add(cube);
      }
    }

    return () => {
      // Remove the old cubes from the scene
      cubesRef.current.forEach((cube) => disposeObject(cube));
      cubesRef.current = [];
    };
  }, [mapData, isModelsLoaded]); // <-- remove mapData from the dependency array when you're ready to implement the updateMap function

  return <div ref={containerRef} />;
}

export default MapScene;

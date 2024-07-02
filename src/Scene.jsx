import React, { useRef, useEffect, useState, useContext } from 'react';
import * as THREE from 'three';
import Tile from './Models/Tile';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { MyContext } from './MyContext';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

function MapScene() {
  const { mapData, selectedCubes, setSelectedCubes, drawerOpen, isModelsLoaded, unitModelRef } = useContext(MyContext); 
  const containerRef = useRef();
  const controlsRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cubesRef = useRef([]);
  
  // Create a raycaster and mouse vector
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Create a color to use when selecting objects
  const colorSelected = new THREE.Color(0xff0000); // Red
  const target = new THREE.Vector3(0,0,0) // Target to rotate around

  // Create vectors to store camera position when mouse is down and up
  var cameraPositionOnButtonDown = new THREE.Vector3();
  var cameraPositionOnButtonUp = new THREE.Vector3();

  const cubes = [];
 
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // Render pass for the entire scene without bloom
    const renderPass = new RenderPass(scene, camera);

    // Render pass for the bloom layer
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.1;
    bloomPass.strength = .2;
    bloomPass.radius = 0.1;
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);

    bloomPass.renderToScreen = false;

    const mixPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
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
        }), 'baseTexture'
    );

    const outputPass = new OutputPass();
    bloomComposer.addPass(outputPass);
    
    const finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderPass);
    finalComposer.addPass(mixPass);
    finalComposer.addPass(outputPass);

    const BLOOM_SCENE = 1;
    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);
    const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const materials = {};

    const nonBloom = ( obj ) => {
      if ( obj.isMesh && bloomLayer.test( obj.layers ) == false ) {
        materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;
      }
    }
    
    const restoreMaterial = ( obj ) => {
      if ( materials[ obj.uuid ] ) {
        obj.material = materials[ obj.uuid ];
        delete materials[ obj.uuid ];
      }
    }

    // check if the render's DOM element is in the container
    const container = containerRef.current;
    if (!container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }

    rendererRef.current = renderer;
    
    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, half intensity
    directionalLight.position.set(0, 30, 0); // Positioned at an angle to the scene
    scene.add(directionalLight);

    // Add an ambient light for soft overall light
    const ambientLight = new THREE.AmbientLight(0xffffff, .5); // Also white light, half intensity
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
    }

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

    window.addEventListener('resize', resizeRendererToDisplaySize);

    // Add Click event listener to window
    const onCanvasClick = (event) => {
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = ( (event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
      mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Filter so we only get the Tile objects
      let tileIntersects = intersects.filter(intersect => {
        return intersect.object.userData.tile instanceof Tile;
      });

      if (tileIntersects.length > 0) {
        const selectedObject = tileIntersects[0].object.userData.tile;
        if (event.type === 'mousedown') {
          cameraPositionOnButtonDown = camera.position.clone();
        }
        if (event.type === 'mouseup') {
          cameraPositionOnButtonUp = camera.position.clone();
        }
        if (!cameraPositionOnButtonDown.equals(cameraPositionOnButtonUp)) {
          return;
        }
        if (event.type === 'mouseup') {
          setSelectedCubes((prevSelectedCubes) => {
            if (prevSelectedCubes.includes(selectedObject)) {
              selectedObject.is_selected = false;
              selectedObject.updateColor();
              return prevSelectedCubes.filter(cube => cube !== selectedObject);
            } else {
              selectedObject.is_selected = true;
              selectedObject.updateColor();
              return [...prevSelectedCubes, selectedObject];
            }
          });
          tileIntersects[0].object.layers.toggle(BLOOM_SCENE);
          cameraPositionOnButtonDown = new THREE.Vector3();
          cameraPositionOnButtonUp = new THREE.Vector3();
        }
      }
    };

    window.addEventListener('mousedown', onCanvasClick);
    window.addEventListener('mouseup', onCanvasClick);

    return () => {
      // Remove the renderer's DOM element from the container
      const container = containerRef.current;
      const renderer = rendererRef.current;
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Clean up event listeners
      window.removeEventListener('mousedown', onCanvasClick);
      window.removeEventListener('resize', resizeRendererToDisplaySize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!isModelsLoaded) return;

    const scene = sceneRef.current;
    if (!scene) return;
    const width = mapData.width;
    const height = mapData.height;
    const map = mapData.ButtonGrid;

    if (!scene || !map) return;
    // Update the cube heights based on the map data
    cubesRef.current.forEach(cube => scene.remove(cube.cube));
    cubesRef.current = [];
    const spacing = 1.00;
    
    if (mapData.ButtonGrid === "empty") {
          console.log("Empty map");
          return;
    }

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Create a cube
        const tileData = map[i][j]; 
        const cube = new Tile(tileData);
        cube.updatePosition((i - Math.floor(width / 2)) * spacing, (j - Math.floor(height / 2)) * spacing);
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
      cubesRef.current.forEach(cube => scene.remove(cube.cube));
      cubesRef.current = [];
    }
  }, [mapData, isModelsLoaded]); // <-- remove mapData from the dependency array when you're ready to implement the updateMap function

  return <div ref={containerRef} />;
}

export default MapScene;

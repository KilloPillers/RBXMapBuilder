import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

function MapScene({ mapData }) {
  const containerRef = useRef();
  const controlsRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  // Create a raycaster and mouse vector
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Create a color to use when selecting objects
  const colorSelected = new THREE.Color(0xff0000); // Red
  const target = new THREE.Vector3(0,0,0) // Target to rotate around

  var cameraPositionOnButtonDown = new THREE.Vector3();
  var cameraPositionOnButtonUp = new THREE.Vector3();
  // Extract map data
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // check if the render's DOM element is in the container
    const container = containerRef.current;
    if (!container.contains(renderer.domElement)) {
      container.appendChild(renderer.domElement);
    }

    rendererRef.current = renderer;
    
    // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, half intensity
    directionalLight.position.set(0, 10, 0); // Positioned at an angle to the scene
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

    const animate = function () {
      requestAnimationFrame(animate);

      // Update camera position
      controls.update();
      
      renderer.render(scene, camera);
    };

    animate();

    // Adjust renderer size to fit the container
    const resizeRendererToDisplaySize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', resizeRendererToDisplaySize);

    // Add Click event listener to window
    const onCanvasClick = (event) => {
      event.preventDefault();
      
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = ( (event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1;
      mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
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
          selectedObject.material.color = (selectedObject.material.color.equals(colorSelected) ? new THREE.Color(0x00ff00) : colorSelected);
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
    const scene = sceneRef.current;
    if (!scene) return;
    const width = mapData.width;
    const height = mapData.height;
    const map = mapData.ButtonGrid;

    if (!scene || !map) return;
    // Update the cube heights based on the map data
    const spacing = 1.005;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Create a cube        
        const geometry = new THREE.BoxGeometry();
        
        // Scale the cubes' height based on the map values
        const cubeHeight = (map !== "empty" ? map[j][i].tile_height : 1);
        geometry.scale(1, cubeHeight, 1);
        geometry.translate(0, cubeHeight/2, 0);

        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); 
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = (i - Math.floor(width / 2)) * spacing;
        cube.position.z = (j - Math.floor(height / 2)) * spacing; 
        scene.add(cube);

      }
    }
    
    return () => {
      // Remove the old cubes from the scene
      scene.children = scene.children.filter((child) => !child.isMesh);
    }
  }, [mapData]);

  return <div ref={containerRef} />;
}

export default MapScene;



import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gouraudMaterial } from './GouraudShader';

function MapScene({width, height}) {
  const containerRef = useRef();
  const controlsRef = useRef();
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const colorSelected = new THREE.Color(0xff0000); // Red
  const target = new THREE.Vector3(0,0,0) // Target to rotate around

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

       // Add a directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light, half intensity
    directionalLight.position.set(3, 3, 3); // Positioned at an angle to the scene
    scene.add(directionalLight);

    // Add an ambient light for soft overall light
    const ambientLight = new THREE.AmbientLight(0xffffff, .5); // Also white light, half intensity
    scene.add(ambientLight);


    const spacing = 1.05;
    const gridSize = width * height;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        // Create a cube        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);

        cube.position.x = (i - Math.floor(width / 2)) * spacing;
        cube.position.z = (j - Math.floor(height / 2)) * spacing; 
        scene.add(cube);
      }
    }

    camera.position.z = 5;
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.target = target;
    controls.update();

    const animate = function () {
      requestAnimationFrame(animate);

      // Update camera position
      controls.update();
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Add Click event listener to window
    const onCanvasClick = (event) => {
      event.preventDefault();
      // Calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        selectedObject.material.color = colorSelected;
      }
    };

    window.addEventListener('mousedown', onCanvasClick);

    return () => {
      window.removeEventListener('click', handleResize);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} />;
}

export default MapScene;


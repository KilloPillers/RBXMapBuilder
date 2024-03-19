import * as THREE from 'three';

// Define Gouraud vertex shader
const vertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Define Gouraud fragment shader
const fragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;

  void main() {
    vec3 light = normalize(vec3(0.5, 0.2, 1.0)); // Light direction
    float intensity = dot(vNormal, light) * 0.5 + 0.5; // Calculate simple diffuse lighting
    gl_FragColor = vec4(uColor * intensity, 1.0); // Apply lighting to the color
  }
`;

// Define ShaderMaterial using the shaders we defined above
export const gouraudMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(0x00ff00) } // Set the color of the material
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});


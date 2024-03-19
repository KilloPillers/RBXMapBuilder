
import * as THREE from 'three';

const vertexShader = `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 newPosition = position + (normal * 0.05); // Move the vertex along its normal
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 outlineColor;

  void main() {
    gl_FragColor = vec4(outlineColor, 1.0); // Set the color of the outline
  }
`;

// Define ShaderMaterial using the shaders we defined above
export const outlineMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    outlineColor: { value: new THREE.Color(0xff0000) } // Example: Red outline
  },
  side: THREE.BackSide // Render the backside of the outline material
});

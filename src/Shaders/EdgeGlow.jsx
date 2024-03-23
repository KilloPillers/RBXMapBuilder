import * as THREE from 'three';

export const EdgeGlowShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }    
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform vec3 edgeColor;
    uniform float thickness;

    void main() {
      vec3 worldNormal = normalize(vNormal);
      vec3 cameraToVertex = normalize(vPosition - cameraPosition);
      float edgeIntensity = dot(worldNormal, cameraToVertex);

      if (edgeIntensity > thickness) { // Adjust this value to control the width of the edge
        discard;
      } else {
        gl_FragColor = vec4(edgeColor, 1.0); // The color of non-edge areas
      }
    }
  `,
  uniforms: {
    edgeColor: { value: new THREE.Color(0xffa500) },
    thickness: { value: 0.01 },
  },
});

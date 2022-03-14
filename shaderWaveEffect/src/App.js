import * as THREE from "three";
import React, {useRef, Suspense} from "react";
import {Canvas, extend, useFrame, useLoader} from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import './App.css';

const WaveShaderMaterial = shaderMaterial(
  // Uniforms
  // Provide a way to send data from JS to our shader
  // Used in both vertex and fragment
  {
    uTime: 0,
    uColor : new THREE.Color(0.0, 0.0, 0.0),
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  // runs first and manipulates the indiviual vertex of the geometry
  glsl`
  precision mediump float;
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;

  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

  void main() {

    vUv = uv;

    vec3 pos = position;
    float noiseFrequency = 2.5;
    float noiseAmp = 0.55;
    vec3 noisePos = vec3(
      pos.x * noiseFrequency + uTime,
      pos.y,
      pos.z
    );

    pos.z += snoise3(noisePos) * noiseAmp;

    vWave = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(
      pos, 1.0
    );

    
  }
  `,
  // Fragment Shader
  // sets color of individal vertex
  glsl`
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vWave;
  

  void main() {
    float wave = vWave * 0.1;
    vec3 texture = texture2D(uTexture, vUv + wave).rgb;
    gl_FragColor = vec4(texture,1.0);
  }
  `
)

extend({WaveShaderMaterial});

const Wave = () => {
  const ref = useRef();

  useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()))
  
  const [image] = useLoader(THREE.TextureLoader, ["https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",])
  
  return (
    <mesh>
      <planeBufferGeometry args={[.4,.6, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image}/>
    </mesh>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{fov:12}}>
    <Suspense fallback={null}>
      <Wave />
    </Suspense>
    </Canvas>
  )
}

const App = () => {
  return (
    <>
      <h1>WAVE EFFECT</h1>
      <Scene />
    </>
  )
}



export default App;

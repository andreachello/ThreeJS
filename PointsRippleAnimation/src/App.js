import './App.css';
import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {Canvas, useFrame, useLoader, extend, useThree} from "react-three-fiber"
import circleImg from "./assets/circle.png"
import { Suspense, useCallback, useMemo, useRef, useState} from 'react';
import DatGui, { DatColor, DatNumber} from "react-dat-gui";
import "react-dat-gui/build/react-dat-gui.css";


// Camera Controls - create JSX component with lower case inital character
extend({OrbitControls})

function CameraControls({opts}) {

  const {camera, gl: {domElement}} = useThree()

  // animate by calling update taking the mouse input and adjusting the camera by each frame
  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update()) 

  return (
    <orbitControls 
    ref={controlsRef}
    args = {[camera, domElement]}
    autoRotate
    autoRotateSpeed={opts.autoRotateSpeed}
    />
  )
}

function Points({opts, setOpts}) {
  // load point as a texture
  const imageTexture = useLoader(THREE.TextureLoader, circleImg)
  // reference to the points component
  const bufferRef = useRef();

  /*
  MODEL
  -----

  Our model takes a distance and number of points to calculate x and z
  which represent the dispersion and count of points on our plane
  We then take a sinusodial model that changes the y values according to
  the (x,z) coordinate system based on a phase shift, frequency and amplitude
  of our sinusodial wave function

  y = Amplitude * sin(frequency * (x^2 + z^2 + theta))

  */

  // constructing the model for y
  // theta = phase shift
  // frequency
  // amplitude

  // use callback hook for performance that takes x and z and creates the corresponding y graph
  const graph = useCallback((x,z) => {
    return Math.sin(opts.frequency * (x **2 + z**2 + opts.theta)) * opts.amplitude;
  },
  // dependecy list so the graph is re-memoized each time the inputs change - no need
  // we have dat gui to take care of this
  // if needed
  // [theta, frequency, opts.amplitude]
  )

  // number of points across one axis
  // points in the entire grid are going to be count^2
  const count = 100
  // distance between each point
  const distance = 3

  // create position of points
  // passing [x1, y1, z1, x2, y2, z2, ...]
  let positions = useMemo(() => {
    let positions = []
    
    // populate array - for coordinate (x,z) and setting y to the sinusoidial model
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        // symmetry around the origin for x an z
        // Distance * (x_i - N/2) -> -N/2 centeres the points around the origin
        let x = distance * (xi - count/2);
        let z = distance * (zi - count/2);
        let y = graph(x, z);
        positions.push(x, y, z)
      }
    }

    return new Float32Array(positions)
  }, 
  // dependency list for useMemo
  [count, distance, graph])

  
  // animate the model using useFrame
  // we manipualte the variable we want to animate
  useFrame(() => {
    opts.theta += opts.thetaAnimate;
    opts.amplitude += opts.amplitudeAnimate;
    
    // update all the y values - get the current array of positions 
    const positions = bufferRef.current.array; // array from the bufferAttribute
    // index to keep track of the position through the positions array 
    let index = 0;
    // modify the values of the array 
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = distance * (xi - count/2);
        let z = distance * (zi - count/2);
        // set y values to the new graph evaluated at x and z
        // we ned to know the corresponding index to the y values - zero indexing so index + 1
        positions[index + 1] = graph(x,z);
        // given each position will have a thruple in the buffer array
        // each time we increment by 3
        index += 3;
      }
  }
        // update the buffer reference
        bufferRef.current.needsUpdate = true;
  })

  return(
    <points>
      <bufferGeometry attach='geometry'>
        <bufferAttribute
          // reference the points component
          ref={bufferRef}
          // attach to the position of these points
          attachObject={['attributes', 'position']}
          array={positions}
          // number of positions - length of array / thriple
          count={positions.length / 3}
          // item size is a thriple of x,y,z coordinates
          itemSize={3}
          />
      </bufferGeometry>
      <pointsMaterial 
        attach='material'
        map={imageTexture}
        color={opts.color}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
        />
    </points>
  )
}

function AnimationCanvas({opts, setOpts}) {
  return(
    <Canvas
      colorManagement={false}
      camera={{position: [100, 10, 0], fov: 75}}>
        <Suspense fallback={null}>
          <Points 
          opts={opts}
          setOpts={setOpts}/>
        </Suspense>
        <CameraControls 
        opts={opts}/>
    </Canvas>
  )
}

function App() {

  const [opts, setOpts] = useState({
    amplitude: 3,
    theta: 0,
    frequency: 0.002,
    color: "#99ccff",
    amplitudeAnimate: 0.001,
    thetaAnimate: 15,
    autoRotateSpeed: -0.2
   
  });

  console.log(opts.amplitude)

  return (
  <div className='anim'>
    <Suspense fallback={<div>Loading</div>}>
      <AnimationCanvas 
        opts={opts}
        setOpts={setOpts}/>
    </Suspense>
    <DatGui data={opts} onUpdate={setOpts}>
        <DatNumber path="amplitude" min={0} max={1000} step={1} />
        <DatNumber path="frequency" min={0} max={50} step={0.001} />
        <DatNumber path="amplitudeAnimate" min={0} max={50} step={0.001} />
        <DatNumber path="thetaAnimate" min={0} max={50} step={1} />
        <DatNumber path="autoRotateSpeed" min={-10} max={50} step={1} />
        <DatColor path="color" />
      </DatGui>
  </div>
  );
}

export default App;

import React, { Suspense, useState } from "react";
//Styles
import "./assets/styles/App.scss";
// Three
import {Canvas, useThree} from "react-three-fiber";
import Lights from "./compoments/Three/lights"
import Floor from "./compoments/Three/floor";
import { softShadows, Loader, OrbitControls} from "@react-three/drei";
// Model
import Model from "./compoments/Three/chest"
import { useSpring } from "react-spring";
// Chest Modal
import ChestModal from "./compoments/chestModal";

softShadows()

// on load zoom effect
const ZoomWithOrbital = () => {
  const {gl, camera} = useThree();
  useSpring({
    from: {
      z:30
    },
    x: -5,
    y: 4,
    z: 4,
    // On Frame
    // onFrame allows us to do a frame by frame callback
    onFrame: ({ x, y, z}) => {
      camera.position.x = x;
      camera.position.y = y;
      camera.position.z = z;
    },
  })
  return (
    <OrbitControls
    enableZoom={false}
    enablePan={false}
    taret = {[0,0,0]}
    args={[camera, gl.domElement]} />
  )
}

const App = () => {
  
  const [open, setOpen] = useState(false);

  return (
    <>
    <Canvas
    colorManagement
    shadowMap
    camera={{position: [-5,4,4], fov: 40}}
    >
      <Lights />
    <Suspense fallback={null}>
      <Model open={open} setOpen={setOpen} />
      <Floor />
      <ZoomWithOrbital />
    </Suspense>
    </Canvas>
    <Loader />
    <ChestModal open={open} setOpen={setOpen}/>
    </>
  );
};

export default App;

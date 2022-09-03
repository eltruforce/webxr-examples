import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  NoToneMapping,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import SpiralSphereGeometry from "../../../components/react-three/ThirdGear/SpiralSphereGeometry";
import { files } from "../../../components/three/ThirdGear/files";

export default function App() {
  var images = [];
  Object.keys(files).forEach((key) => {
    files[key].forEach((name) => images.push(name));
  });

  var tileRatio = 800 / 600;
  var turns = Math.PI / Math.sqrt((4 * Math.PI) / images.length / tileRatio);
  var radius = 1;
  var gap = 0.05;
  var subGrid = 10;

  function Controls() {
    const { camera, gl } = useThree();
    useEffect(() => {
      const controls = new OrbitControls(camera, gl.domElement);
      return () => {
        controls.dispose();
      };
    });
    return null;
  }

  function Floor() {
    const circle = useRef<Mesh>(null!);
    return (
      <mesh ref={circle} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleBufferGeometry args={[radius, 50]} />
        <meshBasicMaterial color={0xa1a1a1} side={DoubleSide} />
      </mesh>
    );
  }

  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          fov: 60,
          far: 100,
          position: [0, 0, 4],
        }}
        // gl={{ toneMapping: NoToneMapping }}
      >
        <color attach="background" args={[0x090c17]} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0xbbbbff}
          intensity={0.3}
        />
        <directionalLight position={[0.2, 1, 1]} />
        <SpiralSphereGeometry
          radius={radius}
          turns={turns}
          gapX={gap}
          gapY={gap}
          tileX={subGrid}
          tileY={subGrid}
          tiles={images.length}
        />
        <Floor />
        <Controls />
      </Canvas>
    </div>
  );
}

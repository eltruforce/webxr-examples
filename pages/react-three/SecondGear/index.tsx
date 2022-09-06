import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh, NoToneMapping } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function App() {
  function Box() {
    const boxRef = useRef<Mesh>(null!);

    useFrame(() => {
      boxRef.current.rotateY(0.01);
    });
    return (
      <mesh ref={boxRef}>
        <boxBufferGeometry />
        <meshStandardMaterial color={0x3657c3} />
      </mesh>
    );
  }

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
        <Box />
        <Controls />
      </Canvas>
    </div>
  );
}

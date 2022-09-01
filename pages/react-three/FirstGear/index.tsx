import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { BackSide, DoubleSide, Mesh, TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function App() {
  const radius = 1;

  function Sphere() {
    const mesh = useRef<Mesh>(null!);
    // const colorMap = useLoader(TextureLoader, "/sky.png");
    return (
      <mesh ref={mesh}>
        <sphereGeometry args={[radius, 50, 25]} />
        {/* <meshPhongMaterial map={colorMap} side={BackSide} /> */}

        <meshStandardMaterial
          color={0xa9a9a9}
          wireframe={true}
          // side={BackSide}
        />
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

  function Floor() {
    const circle = useRef<Mesh>(null!);
    return (
      <mesh ref={circle} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleBufferGeometry args={[radius, 50]} />
        <meshStandardMaterial
          color={0xa9a9a9}
          wireframe={true}
          side={DoubleSide}
        />
      </mesh>
    );
  }

  function Planes() {}

  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          fov: 60,
          far: 100,
          position: [0, 0, 4],
        }}
      >
        <color attach="background" args={[0x090c17]} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0xbbbbff}
          intensity={0.3}
        />
        <directionalLight position={[0.2, 1, 1]} />
        <Sphere />
        <Floor />
        <Controls />
      </Canvas>
    </div>
  );
}

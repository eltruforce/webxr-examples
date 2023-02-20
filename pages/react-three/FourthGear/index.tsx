import { Box } from "@mantine/core";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import Layout from "../../../components/layouts/article";

const TorusKnotMesh = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotateY(0.01);
      meshRef.current.rotateX(0.005);
    }
  });
  return (
    <mesh ref={meshRef}>
      <torusKnotBufferGeometry args={[0.8, 0.3, 120, 16]} />
      {/* <meshBasicMaterial color={0x3657c3} /> */}
      {/* <meshLambertMaterial color={0x3657c3} /> */}
      {/* <meshPhongMaterial color={0x3657c3} specular={0x444444} shininess={60} /> */}
      <meshStandardMaterial color={0x3657c3} roughness={0.5} metalness={0.5} />
    </mesh>
  );
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Layout title="Fourth Gear (R3F)">
      <Box
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Canvas
          camera={{
            fov: 60,
            far: 100,
            position: [0, 0, 4],
          }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={[0x090c17]} />
          <hemisphereLight
            color={0xffffff}
            groundColor={0xbbbbff}
            intensity={0.3}
          />
          <directionalLight position={[0.2, 1, 1]} />
          <TorusKnotMesh />
          <OrbitControls />
        </Canvas>
      </Box>
    </Layout>
  );
};

export default App;

import { Box } from "@mantine/core";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, Shape } from "three";

import Layout from "../../../components/layouts/article";

const Star = () => {
  const meshRef = useRef<Mesh>(null!);
  const shape = new Shape();
  const outerRadius = 0.8;
  const innerRadius = 0.4;
  const PI2 = Math.PI * 2;
  const inc = PI2 / 10;

  shape.moveTo(outerRadius, 0);
  let inner = true;

  for (let theta = inc; theta < PI2; theta += inc) {
    const radius = inner ? innerRadius : outerRadius;
    shape.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
    inner = !inner;
  }

  const extrudeSettings = {
    steps: 1,
    depth: 1,
    bevelEnabled: false,
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotateY(0.01);
    }
  });
  return (
    <mesh ref={meshRef}>
      <extrudeBufferGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color={0x3657c3} />
    </mesh>
  );
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <Layout title="Third Gear (R3F)">
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
          <Star />
          <OrbitControls />
        </Canvas>
      </Box>
    </Layout>
  );
};

export default App;

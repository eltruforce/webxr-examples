import { Container, Box as ContainerBox } from "@mantine/core";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useEffect, useRef } from "react";
import { Mesh } from "three";

const Box = () => {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotateY(0.01);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry />
      <meshStandardMaterial color={0x3657c3} />
    </mesh>
  );
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ContainerBox
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
        gl={{ antialias: true }}
      >
        <color attach="background" args={[0x090c17]} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0xbbbbff}
          intensity={0.3}
        />
        <directionalLight position={[0.2, 1, 1]} />
        <Box />
        <OrbitControls />
      </Canvas>
    </ContainerBox>
  );
};

export default App;

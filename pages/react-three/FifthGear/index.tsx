import { Box, Center, Progress } from "@mantine/core";
import {
  Environment,
  OrbitControls,
  useFBX,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Box3 } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Layout from "../../../components/layouts/article";
import { vector3ToString } from "../../../lib/DebugUtils";

const LoadGLTF = () => {
  const gltf = useLoader(GLTFLoader, "/assets/office-chair.glb");
  const bbox = new Box3().setFromObject(gltf.scene);
  console.log(
    `min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(
      2
    )} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(
      2
    )},${bbox.max.z.toFixed(2)}`
  );

  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.metalness = 0.2;
    }
  });

  useFrame(() => {
    if (gltf.scene) {
      gltf.scene.rotateY(0.01);
    }
  });

  return <primitive object={gltf.scene} />;
};

const LoadFBX = () => {
  const object = useFBX("/assets/office-chair.fbx");
  const bbox = new Box3().setFromObject(object);
  console.log(
    `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(bbox.max, 2)}`
  );

  useFrame(() => {
    if (object) {
      object.rotateY(0.01);
    }
  });

  return <primitive object={object} />;
};

const Loader = () => {
  const { active, progress, errors, item, loaded, total } = useProgress();

  return active && progress != 0 ? (
    <Center
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        opacity: 0.7,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1111,
      }}
    >
      <Progress
        styles={{
          root: {
            background: "#aaa",
            width: "50%",
            minWidth: "250px",
            borderRadius: "10px",
            height: "15px",
          },
          bar: {
            backgroundColor: "#22a",
            width: "50%",
            borderRadius: "10px",
            height: "100%",
          },
        }}
        value={progress}
      />
    </Center>
  ) : null;
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Layout title="Fifth Gear (R3F)">
      <Suspense fallback={<Loader />}>
        <Box
          ref={containerRef}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Canvas
            camera={{
              fov: 60,
              far: 100,
              position: [0, 4, 14],
            }}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={[0x090c17]} />
            <hemisphereLight
              color={0xffffff}
              groundColor={0xbbbbff}
              intensity={0.5}
            />
            <directionalLight
              color={0xffffff}
              intensity={1.5}
              position={[0.2, 1, 1]}
            />

            {/*Uncomment the next lines see FBX loader */}
            <Environment files="/assets/hdr/venice_sunset_1k.hdr" />
            <LoadFBX />

            {/* <LoadGLTF /> */}

            <OrbitControls target={[0, 3.5, 0]} />
          </Canvas>
        </Box>
      </Suspense>
    </Layout>
  );
};

export default App;

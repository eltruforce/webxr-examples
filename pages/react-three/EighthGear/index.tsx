import { Box as ContainerBox } from "@mantine/core";
import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Controllers, XR } from "@react-three/xr";
import { useRef } from "react";
import { IcosahedronBufferGeometry, LineSegments } from "three";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry";
import Layout from "../../../components/layouts/article";
import CustomVRButton from "../../../components/react-three/VRButton";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faVrCardboard } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

library.add(faVrCardboard);

const CustomBoxLineGeometry = ({
  args,
}: {
  args: [number, number, number, number, number, number];
}) => {
  const ref = useRef<LineSegments>();
  const geometry = new BoxLineGeometry(...args);

  useFrame(({ gl, scene, camera }) => {
    if (ref.current) {
      gl.render(scene, camera);
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={[0, 3, 0]}>
      <lineBasicMaterial color={0x808080} />
    </lineSegments>
  );
};

const Room = () => {
  return <CustomBoxLineGeometry args={[6, 6, 6, 10, 10, 10]} />;
};

const Icosahedrons = () => {
  const radius = 0.08;
  const numInstances = 200;

  const geometry = new IcosahedronBufferGeometry(radius, 2);

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const icosahedrons = Array.from({ length: numInstances }, (_, i) => (
    <mesh
      key={i}
      position={[random(-2, 2), random(-2, 2), random(-2, 2)]}
      geometry={geometry}
    >
      <meshLambertMaterial color={Math.random() * 0xffffff} />
    </mesh>
  ));

  return <>{icosahedrons}</>;
};

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Layout title="Eighth Gear (R3F)">
      <ContainerBox
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
        <CustomVRButton />
        <Canvas
          camera={{
            fov: 50,
            near: 0.1,
            far: 100,
            position: [0, 1.6, 3],
          }}
          gl={{ antialias: true }}
        >
          <XR>
            <Controllers />
            <color attach="background" args={[0x090c17]} />
            <hemisphereLight color={0x606060} groundColor={0x404040} />
            <directionalLight position={[1, 1, 1]} color={0xffffff} />
            <OrbitControls target={[0, 1.6, 0]} />
            <Stats />
            <Room />
            <Icosahedrons />
          </XR>
        </Canvas>
      </ContainerBox>
    </Layout>
  );
};

export default App;

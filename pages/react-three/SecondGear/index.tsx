import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function App() {
  //   const scene = new Scene();
  //   scene.background = new Color(0x090c17);

  //   const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
  //   scene.add(ambient);

  //   const light = new DirectionalLight();
  //   light.position.set(0.2, 1, 1);
  //   scene.add(light);

  //   const renderer = new WebGLRenderer({ antialias: true });
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   container.appendChild(renderer.domElement);

  //   renderer.setAnimationLoop(animate.bind(this));

  //   const geometry = new BoxBufferGeometry();
  //   const material = new MeshStandardMaterial({ color: 0x3657c3 });

  //   const mesh = new Mesh(geometry, material);

  //   scene.add(mesh);

  //   const controls = new OrbitControls(camera, renderer.domElement);

  //   window.addEventListener("resize", resize.bind(this));

  //   function resize() {
  //     camera.aspect = window.innerWidth / window.innerHeight;
  //     camera.updateProjectionMatrix();
  //     renderer.setSize(window.innerWidth, window.innerHeight);
  //   }

  function Box() {
    const mesh = useRef<Mesh>(null!);

    useFrame(() => {
      mesh.current.rotateY(0.01);
    });
    return (
      <mesh ref={mesh}>
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
          // aspect: window.innerWidth / window.innerHeight,
        }}
        // dpr={window.devicePixelRatio}
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

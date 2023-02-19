import { Container } from "@mantine/core";
import { Component, useEffect, useRef } from "react";
import {
  BoxBufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;

    const camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4);

    const scene = new Scene();
    scene.background = new Color(0x090c17);

    const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    scene.add(ambient);

    const light = new DirectionalLight();
    light.position.set(0.2, 1, 1);
    scene.add(light);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.setAnimationLoop(render);

    const geometry = new BoxBufferGeometry();
    const material = new MeshStandardMaterial({ color: 0x3657c3 });

    const mesh = new Mesh(geometry, material);

    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("resize", resize);

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render() {
      mesh.rotateY(0.01);
      renderer.render(scene, camera);
    }

    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
    };
  }, []);

  return (
    <Container
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};

export default App;

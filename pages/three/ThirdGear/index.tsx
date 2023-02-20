import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import {
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Layout from "../../../components/layouts/article";

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

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

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

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);

    const material = new MeshStandardMaterial({
      color: 0x3657c3,
    });

    const mesh = new Mesh(geometry, material);

    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(render);

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
    <Layout title="Third Gear (3JS)">
      <Box
        ref={containerRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    </Layout>
  );
};

export default App;

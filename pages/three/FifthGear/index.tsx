import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import {
  Box3,
  Color,
  DirectionalLight,
  HemisphereLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  sRGBEncoding,
  UnsignedByteType,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import Layout from "../../../components/layouts/article";
import { vector3ToString } from "../../../lib/DebugUtils";
import { LoadingBar } from "../../../lib/LoadingBar";

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
    camera.position.set(0, 4, 14);

    const scene = new Scene();
    scene.background = new Color(0x090c17);

    const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.5);
    scene.add(ambient);

    const light = new DirectionalLight(0xffffff, 1.5);
    light.position.set(0.2, 1, 1);
    scene.add(light);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = sRGBEncoding;
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);

    // Observation: If you want to use loadGLB you will need to comment setEnvironment

    setEnvironment();

    const loadingBar = LoadingBar();

    // loadGLTF();
    loadFBX();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 3.5, 0);
    controls.update();

    window.addEventListener("resize", resize);

    let chair;

    function setEnvironment() {
      const loader = new RGBELoader().setDataType(UnsignedByteType);
      const pmremGenerator = new PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      loader.load(
        "/assets/hdr/venice_sunset_1k.hdr",
        (texture) => {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          pmremGenerator.dispose();

          scene.environment = envMap;
        },
        undefined,
        (err) => {
          console.error("An error ocurred setting the environment");
        }
      );
    }

    function loadGLTF() {
      const loader = new GLTFLoader().setPath("/assets/");

      loader.load(
        "office-chair.glb",
        (gltf) => {
          const bbox = new Box3().setFromObject(gltf.scene);
          console.log(
            `min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(
              2
            )},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(
              2
            )},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`
          );

          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              child.material.metalness = 0.2;
            }
          });
          chair = gltf.scene;

          scene.add(gltf.scene);
          loadingBar.visible = false;
          renderer.setAnimationLoop(render);
        },
        (xhr) => {
          loadingBar.progress = xhr.loaded / xhr.total;
        },
        (error) => {
          console.log("An error happened");
        }
      );
    }

    function loadFBX() {
      const loader = new FBXLoader().setPath("/assets/");

      loader.load(
        "office-chair.fbx",
        (object) => {
          chair = object;
          const bbox = new Box3().setFromObject(object);
          console.log(
            `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
              bbox.max,
              2
            )}`
          );
          scene.add(object);
          loadingBar.visible = false;
          renderer.setAnimationLoop(render);
        },
        (xhr) => {
          loadingBar.progress = xhr.loaded / xhr.total;
        },
        (error) => {
          console.log("An error happened");
        }
      );
    }

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render() {
      chair.rotateY(0.01);
      renderer.render(scene, camera);
    }

    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
    };
  }, []);

  return (
    <Layout title="Fifth Gear (3JS)">
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

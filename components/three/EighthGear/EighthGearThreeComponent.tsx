import { Box } from "@mantine/core";
import { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  IcosahedronBufferGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry";
import { VRButton } from "../VRButton";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
import "../../../lib/all";

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const vrButtonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current as HTMLDivElement;

    const camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.6, 3);

    const scene = new Scene();
    scene.background = new Color(0x090c17);

    const ambient = new HemisphereLight(0x606060, 0x404040);
    scene.add(ambient);

    const light = new DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = sRGBEncoding;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const stats = Stats();
    container.appendChild(stats.dom);

    const raycaster = new Raycaster();
    const workingMatrix = new Matrix4();
    const workingVectcor = new Vector3();

    let controllers: any[];

    initScene();
    setupVR();

    window.addEventListener("resize", resize);

    renderer.setAnimationLoop(render);

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function initScene() {
      const radius = 0.08;

      const room = new LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10),
        new LineBasicMaterial({ color: 0x808080 })
      );
      room.geometry.translate(0, 3, 0);
      scene.add(room);

      const geometry = new IcosahedronBufferGeometry(radius, 2);

      for (let i = 0; i < 200; i++) {
        const object = new Mesh(
          geometry,
          new MeshLambertMaterial({ color: Math.random() * 0xffffff })
        );

        object.position.x = random(-2, 2);
        object.position.y = random(-2, 2);
        object.position.z = random(-2, 2);

        room.add(object);
      }
    }

    function setupVR() {
      renderer.xr.enabled = true;

      VRButton({ renderer });

      controllers = buildControllers();
    }

    function buildControllers() {
      const controllerModelFactory = new XRControllerModelFactory();

      const geometry = new BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, -1),
      ]);

      const line = new Line(geometry);
      line.name = "line";
      line.scale.z = 10;

      const controllers = [];

      for (let i = 0; i <= 1; i++) {
        const controller = renderer.xr.getController(i);
        controller.add(line.clone());
        controller.userData.selectPressed = false;
        scene.add(controller);

        controllers.push(controller);

        const grip = renderer.xr.getControllerGrip(i);
        grip.add(controllerModelFactory.createControllerModel(grip));
        scene.add(grip);
      }

      return controllers;
    }

    function handleController(controller) {}

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render() {
      stats.update();

      if (controllers) {
        controllers.forEach((controller) => {
          handleController(controller);
        });
      }

      renderer.render(scene, camera);
    }

    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener("resize", resize);
      renderer.setAnimationLoop(null);
    };
  }, []);

  return (
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
      <div ref={vrButtonContainerRef} />
    </Box>
  );
};

export default App;

import { Component } from "react";
import {
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TorusKnotBufferGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "../../../libs/three/jsm/OrbitControls";

export default class App extends Component {
  componentDidMount(): void {
    const container = document.createElement("div");
    document.body.appendChild(container);

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

    const geometry = new TorusKnotBufferGeometry(0.8, 0.3, 120, 16);

    // Choose between the Materials and see the differences

    // const material = new MeshBasicMaterial({ color: 0x3657c3 });

    // const material = new MeshLambertMaterial({ color: 0x3657c3 });

    // const material = new MeshPhongMaterial({
    //   color: 0x3657c3,
    //   specular: 0x444444,
    //   shininess: 60,
    // });

    const material = new MeshStandardMaterial({
      color: 0x3657c3,
      roughness: 0.5,
      metalness: 0.5,
    });

    const mesh = new Mesh(geometry, material);

    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setAnimationLoop(render.bind(this));

    window.addEventListener("resize", resize.bind(this));

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    resize();

    function render() {
      mesh.rotateY(0.01);
      renderer.render(scene, camera);
    }
    render();
  }
  render() {
    return <div id="container" />;
  }
}

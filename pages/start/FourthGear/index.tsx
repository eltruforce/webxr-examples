import { Component } from "react";
import {
  BoxBufferGeometry,
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

    //Replace Box with Circle, Cone, Cylinder, Dodecahedron, Icosahedron, Octahedron, Plane, Sphere, Tetrahedron, Torus or TorusKnot
    // const geometry = new BoxBufferGeometry();

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

    const material = new MeshStandardMaterial({ color: 0x3657c3 });

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

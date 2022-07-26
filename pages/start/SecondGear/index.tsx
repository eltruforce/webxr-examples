import { Component, useEffect } from "react";
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
import { OrbitControls } from "../../../libs/three/jsm/OrbitControls";

// Method 1
// -------------------------------------------------------------------------------------------------
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
    scene.background = new Color(0xaaaaaa);

    const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    scene.add(ambient);

    const light = new DirectionalLight();
    light.position.set(0.2, 1, 1);
    scene.add(light);

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.setAnimationLoop(this.render.bind(this));

    const geometry = new BoxBufferGeometry();
    const material = new MeshStandardMaterial({ color: 0xff0000 });

    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const controls = new OrbitControls(camera, renderer.domElement);

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
      requestAnimationFrame(render);
    }
    render();
  }

  render() {
    return <div id="container" />;
  }
}
// -------------------------------------------------------------------------------------------------

// Method 2
// -------------------------------------------------------------------------------------------------
// function App() {
//   useEffect(() => {
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     const camera = new PerspectiveCamera(
//       60,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     );
//     camera.position.set(0, 0, 4);

//     const scene = new Scene();
//     scene.background = new Color(0xaaaaaa);

//     const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
//     scene.add(ambient);

//     const light = new DirectionalLight();
//     light.position.set(0.2, 1, 1);
//     scene.add(light);

//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     renderer.setAnimationLoop(render.bind(this));

//     const geometry = new BoxBufferGeometry();
//     const material = new MeshStandardMaterial({ color: 0xff0000 });

//     const mesh = new Mesh(geometry, material);

//     scene.add(mesh);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     window.addEventListener("resize", resize.bind(this));

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }
//     resize();

//     function render() {
//       mesh.rotateY(0.01);
//       renderer.render(scene, camera);
//     }
//     render();
//   }, []);

//   return <div id="container" />;
// }

// export default App;
// -------------------------------------------------------------------------------------------------

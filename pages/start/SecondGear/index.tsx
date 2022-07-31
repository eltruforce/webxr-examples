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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Way 1
// -------------------------------------------------------------------------------------------------
export default class App extends Component {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private mesh: Mesh;

  componentDidMount = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 4);

    this.scene = new Scene();
    this.scene.background = new Color(0x090c17);

    const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
    this.scene.add(ambient);

    const light = new DirectionalLight();
    light.position.set(0.2, 1, 1);
    this.scene.add(light);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.animate.bind(this));

    const geometry = new BoxBufferGeometry();
    const material = new MeshStandardMaterial({ color: 0x3657c3 });

    this.mesh = new Mesh(geometry, material);

    this.scene.add(this.mesh);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", this.resize.bind(this));
  };

  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    this.mesh.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  };

  render = () => <div id="container" />;
}
// -------------------------------------------------------------------------------------------------

// Way 2
// -------------------------------------------------------------------------------------------------
// export default class App extends Component {
//   componentDidMount(): void {
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
//     scene.background = new Color(0x090c17);

//     const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
//     scene.add(ambient);

//     const light = new DirectionalLight();
//     light.position.set(0.2, 1, 1);
//     scene.add(light);

//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     renderer.setAnimationLoop(animate.bind(this));

//     const geometry = new BoxBufferGeometry();
//     const material = new MeshStandardMaterial({ color: 0x3657c3 });

//     const mesh = new Mesh(geometry, material);
//     scene.add(mesh);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     window.addEventListener("resize", resize.bind(this));

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       mesh.rotateY(0.01);
//       renderer.render(scene, camera);
//     }
//   }

//   render() {
//     return <div id="container" />;
//   }
// }
// -------------------------------------------------------------------------------------------------

// Way 3
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
//     scene.background = new Color(0x090c17);

//     const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
//     scene.add(ambient);

//     const light = new DirectionalLight();
//     light.position.set(0.2, 1, 1);
//     scene.add(light);

//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     renderer.setAnimationLoop(animate.bind(this));

//     const geometry = new BoxBufferGeometry();
//     const material = new MeshStandardMaterial({ color: 0x3657c3 });

//     const mesh = new Mesh(geometry, material);

//     scene.add(mesh);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     window.addEventListener("resize", resize.bind(this));

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       mesh.rotateY(0.01);
//       renderer.render(scene, camera);
//     }
//   }, []);

//   return <div id="container" />;
// }

// export default App;
// -------------------------------------------------------------------------------------------------

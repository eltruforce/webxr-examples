import { Component, useEffect } from "react";
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
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Method 1
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

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);

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

    this.mesh = new Mesh(geometry, material);

    this.scene.add(this.mesh);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.renderer.setAnimationLoop(this.animate.bind(this));

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

// Method 2
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

//     const renderer = new WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     const geometry = new TorusKnotBufferGeometry(0.8, 0.3, 120, 16);

//     // Choose between the Materials and see the differences

//     // const material = new MeshBasicMaterial({ color: 0x3657c3 });

//     // const material = new MeshLambertMaterial({ color: 0x3657c3 });

//     // const material = new MeshPhongMaterial({
//     //   color: 0x3657c3,
//     //   specular: 0x444444,
//     //   shininess: 60,
//     // });

//     const material = new MeshStandardMaterial({
//       color: 0x3657c3,
//       roughness: 0.5,
//       metalness: 0.5,
//     });

//     const mesh = new Mesh(geometry, material);

//     scene.add(mesh);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     renderer.setAnimationLoop(animate.bind(this));

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

// Method 3
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

//     const renderer = new WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     const geometry = new TorusKnotBufferGeometry(0.8, 0.3, 120, 16);

//     // Choose between the Materials and see the differences

//     // const material = new MeshBasicMaterial({ color: 0x3657c3 });

//     // const material = new MeshLambertMaterial({ color: 0x3657c3 });

//     // const material = new MeshPhongMaterial({
//     //   color: 0x3657c3,
//     //   specular: 0x444444,
//     //   shininess: 60,
//     // });

//     const material = new MeshStandardMaterial({
//       color: 0x3657c3,
//       roughness: 0.5,
//       metalness: 0.5,
//     });

//     const mesh = new Mesh(geometry, material);

//     scene.add(mesh);

//     const controls = new OrbitControls(camera, renderer.domElement);

//     renderer.setAnimationLoop(animate.bind(this));

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

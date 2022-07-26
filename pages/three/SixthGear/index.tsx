import { Component, useEffect } from "react";
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
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { LoadingBar } from "../../../libs/LoadingBar";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { vector3ToString } from "../../../libs/DebugUtils";

// Way 1
// -------------------------------------------------------------------------------------------------
export default class App extends Component {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private loadingBar: LoadingBar;
  private controls: OrbitControls;
  private chair: any;

  componentDidMount = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.camera = new PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 4, 14);

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
    this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    this.setEnvironment();
    container.appendChild(this.renderer.domElement);

    // Add code here
    this.loadingBar = new LoadingBar();
    this.loadFBX();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 3.5, 0);
    this.controls.update();

    window.addEventListener("resize", this.resize.bind(this));
  };

  setEnvironment = () => {
    const loader = new RGBELoader();
    const pmremGenerator = new PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const self = this;
    loader.load(
      "/assets/hdr/venice_sunset_1k.hdr",
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        self.scene.environment = envMap;
      },
      undefined,
      (err) => {
        console.error("An error occurred setting the environment");
      }
    );
  };

  loadGLTF = () => {
    const self = this;
    const loader = new GLTFLoader().setPath("/assets/");

    loader.load(
      "office-chair.glb",
      (gltf) => {
        self.chair = gltf.scene;
        const bbox = new Box3().setFromObject(gltf.scene);
        console.log(
          `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
            bbox.max,
            2
          )}`
        );
        self.scene.add(gltf.scene);
        self.loadingBar.visible = false;
        self.renderer.setAnimationLoop(self.animate.bind(self));
      },
      (xhr) => {
        self.loadingBar.progress = xhr.loaded / xhr.total;
      },
      (err) => {
        console.log("An error happened");
      }
    );
  };

  loadFBX = () => {
    const self = this;
    const loader = new FBXLoader().setPath("/assets/");

    loader.load(
      "office-chair.fbx",
      (object) => {
        self.chair = object;
        const bbox = new Box3().setFromObject(object);
        console.log(
          `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
            bbox.max,
            2
          )}`
        );
        self.scene.add(object);
        self.loadingBar.visible = false;
        self.renderer.setAnimationLoop(self.animate.bind(self));
      },
      (xhr) => {
        self.loadingBar.progress = xhr.loaded / xhr.total;
      },
      (err) => {
        console.log("An error happened");
      }
    );
  };

  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    this.chair.rotateY(0.01);
    this.renderer.render(this.scene, this.camera);
  };

  render = () => <div id="container" />;
}
// -------------------------------------------------------------------------------------------------

// Way 2
// -------------------------------------------------------------------------------------------------
// export default class App extends Component {
//   componentDidMount(): void {
// const container = document.createElement("div");
// document.body.appendChild(container);

// const camera = new PerspectiveCamera(
//   60,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100
// );
// camera.position.set(0, 4, 14);

// const scene = new Scene();
// scene.background = new Color(0x090c17);

// const ambient = new HemisphereLight(0xffffff, 0xbbbbff, 0.3);
// scene.add(ambient);

// const light = new DirectionalLight();
// light.position.set(0.2, 1, 1);
// scene.add(light);

// const renderer = new WebGLRenderer({ antialias: true, alpha: true });
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.outputEncoding = sRGBEncoding;
// renderer.physicallyCorrectLights = true;
// setEnvironment();
// container.appendChild(renderer.domElement);

// // Add code here
// const loadingBar = new LoadingBar();
// loadGLTF();

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 3.5, 0);
// controls.update();

// window.addEventListener("resize", resize.bind(this));

// function setEnvironment() {
//   const loader = new RGBELoader();
//   const pmremGenerator = new PMREMGenerator(renderer);
//   pmremGenerator.compileEquirectangularShader();
//   loader.load(
//     "/assets/hdr/venice_sunset_1k.hdr",
//     (texture) => {
//       const envMap = pmremGenerator.fromEquirectangular(texture).texture;
//       pmremGenerator.dispose();
//       scene.environment = envMap;
//     },
//     undefined,
//     (err) => {
//       console.error("An error occurred setting the environment");
//     }
//   );
// }

// function loadGLTF() {
//   const loader = new GLTFLoader().setPath("/assets/");

//   loader.load(
//     "office-chair.glb",
//     function (gltf) {
//       const chair = gltf.scene;
//       const bbox = new Box3().setFromObject(gltf.scene);
//       console.log(
//         `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
//           bbox.max,
//           2
//         )}`
//       );
//       scene.add(gltf.scene);
//       loadingBar.visible = false;
//       renderer.setAnimationLoop(animate.bind(this));
//     },
//     function (xhr) {
//       loadingBar.progress = xhr.loaded / xhr.total;
//     },
//     function (err) {
//       console.log("An error happened");
//     }
//   );
// }

// function loadFBX() {
//   const loader = new FBXLoader().setPath("/assets/");

//   loader.load(
//     "office-chair.fbx",
//     function (object) {
//       const chair = object;
//       const bbox = new Box3().setFromObject(object);
//       console.log(
//         `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
//           bbox.max,
//           2
//         )}`
//       );
//       scene.add(object);
//       loadingBar.visible = false;
//       renderer.setAnimationLoop(animate.bind(this));
//     },
//     function (xhr) {
//       loadingBar.progress = xhr.loaded / xhr.total;
//     },
//     function (err) {
//       console.log("An error happened");
//     }
//   );
// }

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       scene.rotateY(0.01);
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
//     camera.position.set(0, 4, 14);

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
//     renderer.outputEncoding = sRGBEncoding;
//     renderer.physicallyCorrectLights = true;
//     setEnvironment();
//     container.appendChild(renderer.domElement);

//     // Add code here
//     const loadingBar = new LoadingBar();
//     loadGLTF();

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.target.set(0, 3.5, 0);
//     controls.update();

//     window.addEventListener("resize", resize.bind(this));

//     function setEnvironment() {
//       const loader = new RGBELoader();
//       const pmremGenerator = new PMREMGenerator(renderer);
//       pmremGenerator.compileEquirectangularShader();
//       loader.load(
//         "/assets/hdr/venice_sunset_1k.hdr",
//         (texture) => {
//           const envMap = pmremGenerator.fromEquirectangular(texture).texture;
//           pmremGenerator.dispose();
//           scene.environment = envMap;
//         },
//         undefined,
//         (err) => {
//           console.error("An error occurred setting the environment");
//         }
//       );
//     }

//     function loadGLTF() {
//       const loader = new GLTFLoader().setPath("/assets/");

//       loader.load(
//         "office-chair.glb",
//         function (gltf) {
//           const chair = gltf.scene;
//           const bbox = new Box3().setFromObject(gltf.scene);
//           console.log(
//             `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
//               bbox.max,
//               2
//             )}`
//           );
//           scene.add(gltf.scene);
//           loadingBar.visible = false;
//           renderer.setAnimationLoop(animate.bind(this));
//         },
//         function (xhr) {
//           loadingBar.progress = xhr.loaded / xhr.total;
//         },
//         function (err) {
//           console.log("An error happened");
//         }
//       );
//     }

//     function loadFBX() {
//       const loader = new FBXLoader().setPath("/assets/");

//       loader.load(
//         "office-chair.fbx",
//         function (object) {
//           const chair = object;
//           const bbox = new Box3().setFromObject(object);
//           console.log(
//             `min:${vector3ToString(bbox.min, 2)} - max:${vector3ToString(
//               bbox.max,
//               2
//             )}`
//           );
//           scene.add(object);
//           loadingBar.visible = false;
//           renderer.setAnimationLoop(animate.bind(this));
//         },
//         function (xhr) {
//           loadingBar.progress = xhr.loaded / xhr.total;
//         },
//         function (err) {
//           console.log("An error happened");
//         }
//       );
//     }

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       scene.rotateY(0.01);
//       renderer.render(scene, camera);
//     }
//   }, []);

//   return <div id="container" />;
// }

// export default App;
// -------------------------------------------------------------------------------------------------

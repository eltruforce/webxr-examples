import { Component, useEffect } from "react";
import {
  BackSide,
  BufferGeometry,
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  IcosahedronBufferGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BoxLineGeometry } from "three/examples/jsm/geometries/BoxLineGeometry";
import Stats from "three/examples/jsm/libs/stats.module";
import { VRButton } from "../../../components/three/NinthGear/VRButton";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory";
import "../../../libs/all";

// Way 1
// -------------------------------------------------------------------------------------------------
export default class App extends Component {
  private clock: Clock;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private stats: Stats;
  private radius: number;
  private room: LineSegments;
  private raycaster: any;
  private workingMatrix: any;
  private workingVector: any;
  private controllers: any;
  private highlight: Mesh;
  private children: any;
  private userData: any;

  componentDidMount = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    this.clock = new Clock();

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1.6, 3);

    this.scene = new Scene();
    this.scene.background = new Color(0x090c17);

    this.scene.add(new HemisphereLight(0x606060, 0x404040));

    const light = new DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    this.scene.add(light);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = sRGBEncoding;

    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1.6, 0);
    this.controls.update();

    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    this.raycaster = new Raycaster();
    this.workingMatrix = new Matrix4();
    this.workingVector = new Vector3();

    this.initScene();
    this.setupXR();

    window.addEventListener("resize", this.resize.bind(this));

    this.renderer.setAnimationLoop(this.animate.bind(this));
  };

  random = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  initScene = () => {
    this.radius = 0.08;

    this.room = new LineSegments(
      new BoxLineGeometry(6, 6, 6, 10, 10, 10),
      new LineBasicMaterial({ color: 0x808080 })
    );
    this.room.geometry.translate(0, 3, 0);
    this.scene.add(this.room);

    const geometry = new IcosahedronBufferGeometry(this.radius, 2);

    for (let i = 0; i < 200; i++) {
      const object = new Mesh(
        geometry,
        new MeshLambertMaterial({ color: Math.random() * 0xffffff })
      );

      object.position.x = this.random(-2, 2);
      object.position.y = this.random(-2, 2);
      object.position.z = this.random(-2, 2);

      this.room.add(object);
    }

    this.highlight = new Mesh(
      geometry,
      new MeshBasicMaterial({ color: 0xffffff, side: BackSide })
    );
    this.highlight.scale.set(1.2, 1.2, 1.2);
    this.scene.add(this.highlight);
  };

  setupXR = () => {
    this.renderer.xr.enabled = true;

    const button = new VRButton(this.renderer, undefined);

    const self = this;

    this.controllers = this.buildControllers();

    const onSelectStart = () => {
      this.children[0].scale.z = 10;
      this.userData.selectPressed = true;
    };

    const onSelectEnd = () => {
      this.children[0].scale.z = 0;
      self.highlight.visible = false;
      this.userData.selectPressed = false;
    };

    this.controllers.forEach((controller) => {
      controller.addEventListener("selectstart", onSelectStart);
      controller.addEventListener("selectend", onSelectEnd);
    });
  };

  buildControllers = () => {
    const controllerModelFactory = new XRControllerModelFactory();

    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, -1),
    ]);

    const line = new Line(geometry);
    line.name = "line";
    line.scale.z = 0;

    const controllers = [];

    for (let i = 0; i <= 1; i++) {
      const controller = this.renderer.xr.getController(i);
      controller.add(line.clone());
      controller.userData.selectPressed = false;
      this.scene.add(controller);

      controllers.push(controller);

      const grip = this.renderer.xr.getControllerGrip(i);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
    }

    return controllers;
  };

  handleController = (controller) => {
    if (controller.userData.selectPressed) {
      controller.children[0].scale.z = 10;

      this.workingMatrix.identity().extractRotation(controller.matrixWorld);

      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);

      this.raycaster.ray.direction
        .set(0, 0, -1)
        .applyMatrix4(this.workingMatrix);

      const intersects = this.raycaster.intersectObjects(this.room.children);

      if (intersects.length > 0) {
        intersects[0].object.add(this.highlight);
        this.highlight.visible = true;
        controller.children[0].scale.z = intersects[0].distance;
      } else {
        this.highlight.visible = false;
      }
    }
  };

  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
    this.stats.update();

    if (this.controllers) {
      const self = this;
      this.controllers.forEach((controller) => {
        self.handleController(controller);
      });
    }

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

//     const clock = new Clock();

//     const camera = new PerspectiveCamera(
//       50,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     );
//     camera.position.set(0, 1.6, 3);

//     const scene = new Scene();
//     scene.background = new Color(0x090c17);

//     scene.add(new HemisphereLight(0x606060, 0x404040));

//     const light = new DirectionalLight(0xffffff);
//     light.position.set(1, 1, 1).normalize();
//     scene.add(light);

//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.outputEncoding = sRGBEncoding;

//     container.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.target.set(0, 1.6, 0);
//     controls.update();

//     const stats = Stats();
//     document.body.appendChild(stats.dom);

//     const raycaster = new Raycaster();
//     const workingMatrix = new Matrix4();
//     const workingVector = new Vector3();

//     initScene();
//     setupXR();

//     window.addEventListener("resize", resize.bind(this));

//     renderer.setAnimationLoop(animate.bind(this));

//     function random(min, max) {
//       return Math.random() * (max - min) + min;
//     }

//     function initScene() {
//       const radius = 0.08;

//       const room = new LineSegments(
//         new BoxLineGeometry(6, 6, 6, 10, 10, 10),
//         new LineBasicMaterial({ color: 0x808080 })
//       );
//       room.geometry.translate(0, 3, 0);
//       scene.add(room);

//       const geometry = new IcosahedronBufferGeometry(radius, 2);

//       for (let i = 0; i < 200; i++) {
//         const object = new Mesh(
//           geometry,
//           new MeshLambertMaterial({ color: Math.random() * 0xffffff })
//         );

//         object.position.x = random(-2, 2);
//         object.position.y = random(-2, 2);
//         object.position.z = random(-2, 2);

//         room.add(object);
//       }
//     }

//     function setupXR() {
//       renderer.xr.enabled = true;

//       const button = new VRButton(renderer, undefined);

//       const controllers = buildControllers();
//     }

//     function buildControllers() {
//       const controllerModelFactory = new XRControllerModelFactory();

//       const geometry = new BufferGeometry().setFromPoints([
//         new Vector3(0, 0, 0),
//         new Vector3(0, 0, -1),
//       ]);
//       const line = new Line(geometry);
//       line.name = "line";
//       line.scale.z = 0;

//       const controllers = [];

//       for (let i = 0; i <= 1; i++) {
//         const controller = renderer.xr.getController(i);
//         controller.add(line.clone());
//         controller.userData.selectPressed = false;
//         scene.add(controller);

//         controllers.push(controller);

//         const grip = renderer.xr.getControllerGrip(i);
//         grip.add(controllerModelFactory.createControllerModel(grip));
//         scene.add(grip);
//       }

//       return controllers;
//     }

//     function handleController(controller) {}

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       stats.update();

//       if (this.controllers) {
//         this.controllers.forEach((controller) => {
//           handleController(controller);
//         });
//       }

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
//   var controllers: any;

//   useEffect(() => {
//     const container = document.createElement("div");
//     document.body.appendChild(container);

//     const clock = new Clock();

//     const camera = new PerspectiveCamera(
//       50,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     );
//     camera.position.set(0, 1.6, 3);

//     const scene = new Scene();
//     scene.background = new Color(0x090c17);

//     scene.add(new HemisphereLight(0x606060, 0x404040));

//     const light = new DirectionalLight(0xffffff);
//     light.position.set(1, 1, 1).normalize();
//     scene.add(light);

//     const renderer = new WebGLRenderer({ antialias: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.outputEncoding = sRGBEncoding;

//     container.appendChild(renderer.domElement);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.target.set(0, 1.6, 0);
//     controls.update();

//     const stats = Stats();
//     document.body.appendChild(stats.dom);

//     const raycaster = new Raycaster();
//     const workingMatrix = new Matrix4();
//     const workingVector = new Vector3();

//     initScene();
//     setupXR();

//     window.addEventListener("resize", resize.bind(this));

//     renderer.setAnimationLoop(animate.bind(this));

//     function random(min, max) {
//       return Math.random() * (max - min) + min;
//     }

//     function initScene() {
//       const radius = 0.08;

//       const room = new LineSegments(
//         new BoxLineGeometry(6, 6, 6, 10, 10, 10),
//         new LineBasicMaterial({ color: 0x808080 })
//       );
//       room.geometry.translate(0, 3, 0);
//       scene.add(room);

//       const geometry = new IcosahedronBufferGeometry(radius, 2);

//       for (let i = 0; i < 200; i++) {
//         const object = new Mesh(
//           geometry,
//           new MeshLambertMaterial({ color: Math.random() * 0xffffff })
//         );

//         object.position.x = random(-2, 2);
//         object.position.y = random(-2, 2);
//         object.position.z = random(-2, 2);

//         room.add(object);
//       }
//     }

//     function setupXR() {
//       renderer.xr.enabled = true;

//       const button = new VRButton(renderer, undefined);

//       const controllers = buildControllers();
//     }

//     function buildControllers() {
//       const controllerModelFactory = new XRControllerModelFactory();

//       const geometry = new BufferGeometry().setFromPoints([
//         new Vector3(0, 0, 0),
//         new Vector3(0, 0, -1),
//       ]);
//       const line = new Line(geometry);
//       line.name = "line";
//       line.scale.z = 0;

//       const controllers = [];

//       for (let i = 0; i <= 1; i++) {
//         const controller = renderer.xr.getController(i);
//         controller.add(line.clone());
//         controller.userData.selectPressed = false;
//         scene.add(controller);

//         controllers.push(controller);

//         const grip = renderer.xr.getControllerGrip(i);
//         grip.add(controllerModelFactory.createControllerModel(grip));
//         scene.add(grip);
//       }

//       return controllers;
//     }

//     function handleController(controller) {}

//     function resize() {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     }

//     function animate() {
//       stats.update();

//       if (controllers) {
//         controllers.forEach((controller) => {
//           handleController(controller);
//         });
//       }

//       renderer.render(scene, camera);
//     }
//   }, []);

//   return <div id="container" />;
// }

// export default App;
// -------------------------------------------------------------------------------------------------

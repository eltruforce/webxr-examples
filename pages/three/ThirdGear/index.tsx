import { Component, useEffect } from "react";
import {
  AmbientLight,
  BackSide,
  BoxBufferGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleBufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereBufferGeometry,
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { files } from "../../../components/three/ThirdGear/files";
import { SpiralSphereGeometry } from "../../../components/three/ThirdGear/SpiralSphereGeometry";

// Way 1
// -------------------------------------------------------------------------------------------------

export default class App extends Component {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private mesh: Mesh;

  componentDidMount = () => {
    var images = [];

    Object.keys(files).forEach((key) => {
      files[key].forEach((name) => images.push(name));
    });

    var tileRatio = 800 / 600;
    var turns = Math.PI / Math.sqrt((4 * Math.PI) / images.length / tileRatio);
    var radius = 1;
    var gap = 0.05;
    var subGrid = 10;

    var texSize = Math.ceil(Math.sqrt(images.length));
    var uvZoom = 0.01;
    var uvZoom2 = 0.065;
    var zoomSpeed = 0.25;

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

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(this.animate.bind(this));

    const sphere = SpiralSphereGeometry(
      radius,
      turns,
      gap,
      gap,
      subGrid,
      subGrid,
      images.length
    );

    // sphere.setAttribute(
    //   "zoom",
    //   new BufferAttribute(new Float32Array(sphere.attributes.id.count), 1)
    // );
    // sphere.setAttribute("uv2", sphere.attributes.uv.clone());
    // sphere.computeVertexNormals();
    // this.computeTileUVs(sphere, texSize, sphere.attributes.uv, uvZoom);
    // this.computeTileUVs(sphere, texSize, sphere.attributes.uv2, uvZoom2);

    const material = new MeshBasicMaterial({ color: 0xa1a1a1, side: BackSide });
    // new TextureLoader().load("/all_in_one.png", function (map) {
    //   material.color = null;
    //   material.map = map;
    //   material.needsUpdate = true;
    // });

    // console.log(images);
    this.mesh = new Mesh(sphere, material);

    this.scene.add(this.mesh);

    const floor = new CircleBufferGeometry(radius, 50);
    const floorMaterial = new MeshBasicMaterial({
      color: 0xa1a1a1,
      side: DoubleSide,
    });
    const meshFloor = new Mesh(floor, floorMaterial);

    meshFloor.rotation.set(-Math.PI / 2, 0, 0);
    this.scene.add(meshFloor);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", this.resize.bind(this));
  };

  computeTileUVs = (sphere, texSize, aUv, uvZoom) => {
    for (var i = 0; i < sphere.attributes.id.count; i++) {
      var id = sphere.attributes.id.array[i];
      var j = Math.floor(id / texSize);
      var q = (1 - 2 * uvZoom) / texSize;
      var u0 = (id + uvZoom) / texSize - j;
      var v0 = 1 - (j + 1 - uvZoom) / texSize;

      aUv.array[2 * i] *= q;
      aUv.array[2 * i] += u0;
      aUv.array[2 * i + 1] *= q;
      aUv.array[2 * i + 1] += v0;
    }
  };

  resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  animate = () => {
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

//     window.addEventListener("resize", resize.bind(this));

//     function resize() {}

//     function animate() {}
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

//     window.addEventListener("resize", resize.bind(this));

//     function resize() {}

//     function animate() {}
//   }, []);

//   return <div id="container" />;
// }

// export default App;
// -------------------------------------------------------------------------------------------------

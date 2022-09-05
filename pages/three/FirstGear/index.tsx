import { Component, useEffect } from "react";
import {
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
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

    const geometry = new SphereGeometry(1, 50, 25);
    const material = new MeshBasicMaterial({
      color: "#A9A9A9",
      wireframe: true,
    });
    this.mesh = new Mesh(geometry, material);
    this.scene.add(this.mesh);

    const vertices = geometry.attributes.position.array as Array<number>;

    const length = vertices.length;

    var lookDirection = new Vector3();
    var target = new Vector3();

    const planeGeometry = new PlaneGeometry(0.1, 0.1, 16, 16);
    const planeMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
    });

    for (let i = 0, l = length; i < l; i += 3) {
      if (Math.random() * 10 > 2.9956) {
        const planeMesh = new Mesh(planeGeometry, planeMaterial);

        const v = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);

        // vertices[i] = v.x;
        // vertices[i + 1] = v.y;
        // vertices[i + 2] = v.z;

        // planeMesh.position.set( v.x, v.y, v.z );
        planeMesh.position.copy(v);

        lookDirection
          .subVectors(planeMesh.position, this.mesh.position)
          .normalize();
        target.copy(planeMesh.position).add(lookDirection);
        planeMesh.lookAt(target);

        this.scene.add(planeMesh);
      }
    }

    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", this.resize.bind(this));
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

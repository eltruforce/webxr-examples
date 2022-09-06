import {
  Canvas,
  MeshProps,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BackSide,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  TextureLoader,
  Vector3,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function App() {
  function Sphere() {
    const sphereRef = useRef<Mesh>(null!);

    const planeRef = useRef(null!);

    const planeGeometry = new PlaneGeometry(0.1, 0.1, 16, 16);
    const planeMaterial = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
    });

    const tempPlanes = new Object3D();

    useEffect(() => {
      let counter = 0;
      const vertices = sphereRef.current.geometry.attributes.position
        .array as Array<number>;

      const length = vertices.length;

      const lookDirection = new Vector3();
      const target = new Vector3();

      for (let i = 0; i < length; i += 3) {
        if (Math.random() * 10 > 2.9956) {
          const id = (counter += 3);
          const v = new Vector3(vertices[i], vertices[i + 1], vertices[i + 2]);

          tempPlanes.position.copy(v);
          console.log(tempPlanes.position);

          tempPlanes.updateMatrix();

          planeRef.current.setMatrixAt(id, tempPlanes.matrix);

          //  planeRef.current.position.set( v.x, v.y, v.z );
          // planeRef.current.position.copy(v);

          // console.log(planeRef.current.position);
          // const interval = setInterval(
          //   () => planeRef.current.position.copy(v),
          //   1
          // );

          // lookDirection
          //   .subVectors(planeRef.current.position, sphereRef.current.position)
          //   .normalize();
          // target.copy(planeRef.current.position).add(lookDirection);
          // planeRef.current.lookAt(target);

          lookDirection
            .subVectors(tempPlanes.position, sphereRef.current.position)
            .normalize();
          target.copy(tempPlanes.position).add(lookDirection);
          tempPlanes.lookAt(target);

          // return () => clearInterval(interval);

          // const planeMesh = new Mesh(planeGeometry, planeMaterial);
          // planeMesh.position.copy(v);

          // planeMesh.updateMatrix();
          // planeRef.current.setMatrixAt(id, planeMesh.matrix);

          // lookDirection
          //   .subVectors(planeMesh.position, sphereRef.current.position)
          //   .normalize();
          // target.copy(planeMesh.position).add(lookDirection);
          // planeMesh.lookAt(target);
        }
      }

      planeRef.current.instanceMatrix.needsUpdate = true;
    }, []);

    return (
      <group>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1, 50, 25]} />
          <meshStandardMaterial color={0xa9a9a9} wireframe={true} />
        </mesh>
        <instancedMesh
          ref={planeRef}
          args={[planeGeometry, planeMaterial, 3000]}
        />
        ;
        {/* <mesh ref={planeRef}>
          <planeGeometry args={[0.1, 0.1, 16, 16]} />
          <meshBasicMaterial color={0xffffff} side={DoubleSide} />
        </mesh> */}
      </group>
    );
  }

  function Plane(props: MeshProps) {
    const planeRef = useRef<Mesh>(null!);

    if (!planeRef || !planeRef.current) {
      return;
    }

    return (
      <mesh ref={planeRef} {...props}>
        <planeGeometry args={[0.1, 0.1, 16, 16]} />
        <meshBasicMaterial color={0xffffff} side={DoubleSide} />
      </mesh>
    );
  }

  function Controls() {
    const { camera, gl } = useThree();
    useEffect(() => {
      const controls = new OrbitControls(camera, gl.domElement);
      return () => {
        controls.dispose();
      };
    });
    return null;
  }

  function Floor() {
    const floorRef = useRef<Mesh>(null!);
    return (
      <mesh ref={floorRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleBufferGeometry args={[1, 50]} />
        <meshStandardMaterial
          color={0xa9a9a9}
          wireframe={true}
          side={DoubleSide}
        />
      </mesh>
    );
  }

  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          fov: 60,
          far: 100,
          position: [0, 0, 4],
        }}
      >
        <color attach="background" args={[0x090c17]} />
        <hemisphereLight
          color={0xffffff}
          groundColor={0xbbbbff}
          intensity={0.3}
        />
        <directionalLight position={[0.2, 1, 1]} />
        <Sphere />
        <Floor />
        <Controls />
      </Canvas>
    </div>
  );
}

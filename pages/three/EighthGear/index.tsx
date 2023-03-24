import dynamic from "next/dynamic";
import Layout from "../../../components/layouts/article";

const ThreeComponent = dynamic(
  () => import("../../../components/three/EighthGear/EighthGearThreeComponent"),
  { ssr: false }
);

const App = () => {
  return (
    <Layout title="Eighth Gear (3JS)">
      <ThreeComponent />
    </Layout>
  );
};

export default App;

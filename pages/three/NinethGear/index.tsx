import dynamic from "next/dynamic";
import Layout from "../../../components/layouts/article";

const ThreeComponent = dynamic(
  () => import("../../../components/three/NinethGear/NinethGearThreeComponent"),
  { ssr: false }
);

const App = () => {
  return (
    <Layout title="Nineth Gear (3JS)">
      <ThreeComponent />
    </Layout>
  );
};

export default App;

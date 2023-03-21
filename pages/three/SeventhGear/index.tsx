import dynamic from "next/dynamic";
import Layout from "../../../components/layouts/article";

const ThreeComponent = dynamic(
  () => import("../../../components/three/SeventhGear/SeventhGearThreeComponent"),
  { ssr: false }
);

const App = () => {
  return (
    <Layout title="Seventh Gear (3JS)">
      <ThreeComponent />
    </Layout>
  );
};

export default App;

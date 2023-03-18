import dynamic from "next/dynamic";
import Layout from "../../../components/layouts/article";

const ThreeComponent = dynamic(
  () => import("../../../components/SixthGearThreeComponent"),
  { ssr: false }
);

const App = () => {
  return (
    <Layout title="Sixth Gear (3JS)">
      <ThreeComponent />
    </Layout>
  );
};

export default App;

import { Component, useEffect } from "react";

// Way 1
// -------------------------------------------------------------------------------------------------
export default class App extends Component {
  componentDidMount = () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    window.addEventListener("resize", this.resize.bind(this));

  };

  resize = () => {};

  animate = () => {};

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

//     function render() {}
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

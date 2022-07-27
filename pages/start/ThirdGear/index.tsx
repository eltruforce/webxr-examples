import { Component } from "react";

export default class App extends Component {
  componentDidMount(): void {
    const container = document.createElement("div");
    document.body.appendChild(container);

    window.addEventListener("resize", resize.bind(this));

    function resize() {

    }
    resize();

    function render() {
        
    }
    render();
  }
  render() {
    return <div id="container" />;
  }
}

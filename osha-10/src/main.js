import { Engine } from "@babylonjs/core";
import { createScene } from "./scene/createScene.js";
import { setupInterface } from "./ui/setupInterface.js";

const canvas = document.getElementById("renderCanvas");

canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    console.error("WebGL context was lost.");
});

canvas.addEventListener("webglcontextrestored", () => {
    console.log("WebGL context was restored.");
});

const webglContext =
    canvas.getContext("webgl2", { antialias: true }) ??
    canvas.getContext("webgl", { antialias: true });

if (!webglContext) {
    throw new Error("WebGL is required to run the excavation scene.");
}

// Supplying a WebGL context directly keeps Babylon on its WebGL renderer even
// when the browser also supports WebGPU.
const engine = new Engine(webglContext, true);

setupInterface();

const scene = await createScene({ engine, canvas });

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());

import { Engine } from "@babylonjs/core";
import { createScene } from "./scene/createScene.js";
import { setupInterface } from "./ui/setupInterface.js";

const canvas = document.getElementById("renderCanvas");
const engine = new Engine(canvas, true);

setupInterface();

const scene = await createScene({ engine, canvas });

engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());

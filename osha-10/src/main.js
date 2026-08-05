import { Engine } from "@babylonjs/core";
import { createScene } from "./scene/createScene.js";
import { setupInterface } from "./ui/setupInterface.js";

async function main() {
    const canvas = document.getElementById("renderCanvas");
    if (!canvas) {
        throw new Error('Missing required canvas element "#renderCanvas".');
    }

    canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        console.error("WebGL context was lost.");
    });

    canvas.addEventListener("webglcontextrestored", () => {
        console.log("WebGL context was restored.");
    });

    const engine = new Engine(canvas, true);

    setupInterface();

    const scene = await createScene({ engine, canvas });

    const diagnostics = {
        engine,
        scene,
        framesRendered: 0,
    };
    window.__excavationDebug = diagnostics;

    engine.runRenderLoop(() => {
        scene.render();
        diagnostics.framesRendered += 1;

        if (diagnostics.framesRendered === 1) {
            console.info("Excavation scene rendered its first frame.", {
                webGLVersion: engine.webGLVersion,
                renderSize: [engine.getRenderWidth(), engine.getRenderHeight()],
                activeCamera: scene.activeCamera?.name ?? null,
                meshes: scene.meshes.length,
                activeMeshes: scene.getActiveMeshes().length,
                ready: scene.isReady(),
            });
        }
    });

    window.addEventListener("resize", () => engine.resize());
}

main().catch((error) => {
    console.error("Failed to start OSHA training scene:", error);
});

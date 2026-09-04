import { Engine } from "@babylonjs/core";
import { createScene, interfaceConfig, moduleMetadata } from "@game-module";
import "./shared/styles/base.css";
import { setupBackgroundMusic } from "./shared/audio/setupBackgroundMusic.js";
import { createScoringSystem } from "./shared/gameplay/createScoringSystem.js";
import { createMainInterfaceUi } from "./shared/ui/main-interface/createMainInterfaceUi.js";
import { createStartScreenUi } from "./shared/ui/start-screen/createStartScreenUi.js";
import { setupGameTimer } from "./shared/ui/setupGameTimer.js";
import { setupInterface } from "./shared/ui/setupInterface.js";
import { setupScoreDisplay } from "./shared/ui/setupScoreDisplay.js";
import { setupStartScreen } from "./shared/ui/setupStartScreen.js";

async function main() {
    if (moduleMetadata.id !== __GAME_MODULE_ID__) {
        throw new Error(
            `Build target ${__GAME_MODULE_ID__} loaded module ${moduleMetadata.id}`
        );
    }
    document.title = moduleMetadata.documentTitle;
    document.body.dataset.moduleId = moduleMetadata.id;
    document.body.classList.toggle(
        "module-scaffold",
        moduleMetadata.status === "scaffold"
    );
    const app = document.getElementById("app");
    createMainInterfaceUi({ root: app, config: interfaceConfig.mainInterface });
    createStartScreenUi({ root: app, config: interfaceConfig.startScreen });

    const gameTimer = setupGameTimer();
    const scoring = createScoringSystem({
        correctPoints: 10,
        incorrectPoints: -5,
    });
    const scoreDisplay = setupScoreDisplay(scoring);
    const backgroundMusic = setupBackgroundMusic();
    backgroundMusic.play();
    const startScreen = setupStartScreen({
        readyLabel: interfaceConfig.startScreen.readyLabel,
        onStart: () => {
            scoring.reset();
            if (moduleMetadata.status !== "scaffold") {
                scoreDisplay.show();
                gameTimer.start();
            }
            backgroundMusic.pause();
        },
    });
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

    setupInterface(interfaceConfig.mainInterface);

    const scene = await createScene({
        engine,
        canvas,
        scoring,
        onModuleComplete: () => {
            gameTimer.stop();
        },
    });
    startScreen.markReady();

    const diagnostics = {
        moduleId: moduleMetadata.id,
        engine,
        scene,
        scoring,
        framesRendered: 0,
    };
    window.__oshaModuleDebug = diagnostics;
    if (moduleMetadata.id === "module-2") {
        window.__excavationDebug = diagnostics;
    }

    engine.runRenderLoop(() => {
        scene.render();
        diagnostics.framesRendered += 1;

        if (diagnostics.framesRendered === 1) {
            console.info(`${moduleMetadata.title} rendered its first frame.`, {
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
    console.error(`Failed to start ${moduleMetadata.title}:`, error);
});

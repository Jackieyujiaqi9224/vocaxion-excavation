import { Engine } from "@babylonjs/core/Engines/engine.js";
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

function showStartupError(error) {
    console.error(`Failed to start ${moduleMetadata.title}:`, error);
    if (document.getElementById("startupError")) return;

    const overlay = document.createElement("section");
    overlay.id = "startupError";
    overlay.className = "startup-error";
    overlay.setAttribute("role", "alert");
    overlay.setAttribute("aria-labelledby", "startupErrorTitle");

    const card = document.createElement("div");
    card.className = "startup-error-card";
    const title = document.createElement("h1");
    title.id = "startupErrorTitle";
    title.textContent = `${moduleMetadata.title} could not start`;
    const message = document.createElement("p");
    message.textContent =
        "The 3D experience could not continue. Check your connection, then try again.";
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Try again";
    retry.addEventListener("click", () => window.location.reload());
    card.append(title, message, retry);

    if (import.meta.env.DEV && error instanceof Error) {
        const details = document.createElement("pre");
        details.textContent = error.message;
        card.append(details);
    }

    overlay.append(card);
    document.body.append(overlay);
    retry.focus();
}

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
    const backgroundMusic = moduleMetadata.status === "scaffold"
        ? null
        : setupBackgroundMusic();
    backgroundMusic?.play();
    let gameStartHandler = null;
    const startScreen = setupStartScreen({
        readyLabel: interfaceConfig.startScreen.readyLabel,
        onStart: () => {
            scoring.reset();
            if (moduleMetadata.status !== "scaffold") {
                scoreDisplay.show();
                gameTimer.start();
            }
            backgroundMusic?.pause();
            gameStartHandler?.();
        },
    });
    const canvas = document.getElementById("renderCanvas");
    if (!canvas) {
        throw new Error('Missing required canvas element "#renderCanvas".');
    }

    canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        showStartupError(new Error("The browser lost its WebGL context."));
    });

    canvas.addEventListener("webglcontextrestored", () => {
        if (import.meta.env.DEV) {
            console.info("WebGL context was restored.");
        }
    });

    const engine = new Engine(canvas, true);
    engine.renderEvenInBackground = false;

    setupInterface(interfaceConfig.mainInterface);

    let scene;
    try {
        scene = await createScene({
            engine,
            canvas,
            scoring,
            registerStartHandler(handler) {
                if (typeof handler !== "function") {
                    throw new Error("The game start handler must be a function");
                }
                if (gameStartHandler) {
                    throw new Error("A game start handler is already registered");
                }
                gameStartHandler = handler;
            },
            onModuleComplete: () => {
                gameTimer.stop();
            },
        });
    } catch (error) {
        engine.dispose();
        throw error;
    }
    startScreen.markReady();

    let diagnostics = null;
    if (import.meta.env.DEV) {
        diagnostics = {
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
    }

    let renderFailed = false;
    engine.runRenderLoop(() => {
        if (renderFailed) return;
        try {
            scene.render();
        } catch (error) {
            renderFailed = true;
            engine.stopRenderLoop();
            showStartupError(error);
            return;
        }

        if (diagnostics) {
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
        }
    });

    window.addEventListener("resize", () => engine.resize());
}

window.addEventListener("error", (event) => {
    if (event.error instanceof Error) showStartupError(event.error);
});
window.addEventListener("unhandledrejection", (event) => {
    const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason ?? "Unknown asynchronous error"));
    showStartupError(error);
});

main().catch(showStartupError);

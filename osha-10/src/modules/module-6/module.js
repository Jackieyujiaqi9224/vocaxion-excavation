import { createPlaceholderScene } from "../../shared/module/createPlaceholderScene.js";
export { interfaceConfig } from "./config/interfaceConfig.js";

export const moduleMetadata = Object.freeze({
    id: "module-6",
    number: 6,
    title: "Game Module VI",
    documentTitle: "OSHA Safety Training — Module VI",
    status: "scaffold",
});

export const createScene = (context) =>
    createPlaceholderScene({ ...context, metadata: moduleMetadata });

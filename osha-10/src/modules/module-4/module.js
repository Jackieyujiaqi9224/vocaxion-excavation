import { createPlaceholderScene } from "../../shared/module/createPlaceholderScene.js";
export { interfaceConfig } from "./config/interfaceConfig.js";

export const moduleMetadata = Object.freeze({
    id: "module-4",
    number: 4,
    title: "Game Module IV",
    documentTitle: "OSHA Safety Training — Module IV",
    status: "scaffold",
});

export const createScene = (context) =>
    createPlaceholderScene({ ...context, metadata: moduleMetadata });

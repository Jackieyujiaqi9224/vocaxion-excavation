import { createPlaceholderScene } from "../../shared/module/createPlaceholderScene.js";
export { interfaceConfig } from "./config/interfaceConfig.js";

export const moduleMetadata = Object.freeze({
    id: "module-3",
    number: 3,
    title: "Game Module III",
    documentTitle: "OSHA Safety Training — Module III",
    status: "scaffold",
});

export const createScene = (context) =>
    createPlaceholderScene({ ...context, metadata: moduleMetadata });

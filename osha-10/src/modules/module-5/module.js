import { createPlaceholderScene } from "../../shared/module/createPlaceholderScene.js";
export { interfaceConfig } from "./config/interfaceConfig.js";

export const moduleMetadata = Object.freeze({
    id: "module-5",
    number: 5,
    title: "Game Module V",
    documentTitle: "OSHA Safety Training — Module V",
    status: "scaffold",
});

export const createScene = (context) =>
    createPlaceholderScene({ ...context, metadata: moduleMetadata });

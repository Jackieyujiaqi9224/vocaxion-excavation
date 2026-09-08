import { setupClickableHazard } from "./setupClickableHazard.js";
import { createMechanicGroup } from "./setupGameFlow.js";

export function createHazardInspection({
    scene,
    canvas,
    scoring,
    uiConfig,
    groups,
}) {
    if (!groups || typeof groups !== "object" || Array.isArray(groups)) {
        throw new Error("Hazard inspection needs a groups object");
    }

    const groupIds = Object.keys(groups);
    if (!groupIds.length) {
        throw new Error("Hazard inspection needs at least one group");
    }

    const allSystems = [];
    const mechanics = {};
    const isUnavailable = () =>
        allSystems.some((hazard) => hazard.isOpen());

    groupIds.forEach((id) => {
        const definitions = groups[id];
        if (!Array.isArray(definitions) || !definitions.length) {
            throw new Error(`Hazard group ${id} needs a non-empty definitions array`);
        }

        const systems = definitions.map((definition) => {
            const system = setupClickableHazard({
                scene,
                canvas,
                definition,
                uiConfig,
                scoring,
                isUnavailable,
            });
            allSystems.push(system);
            return system;
        });
        mechanics[id] = createMechanicGroup(systems, { id });
    });

    return { mechanics, allSystems };
}

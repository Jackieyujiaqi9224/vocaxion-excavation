const AUTOMATIC_ACTIVATION = "automatic";
const MANUAL_ACTIVATION = "manual";

function validateFlowConfig(config, mechanics) {
    if (!config?.id) {
        throw new Error("Game-flow config needs an id");
    }
    if (!config.steps?.length) {
        throw new Error(`Game-flow config ${config.id} needs steps`);
    }

    const stepById = new Map();
    config.steps.forEach((step) => {
        if (!step.id) {
            throw new Error(`Game-flow config ${config.id} has a step without an id`);
        }
        if (stepById.has(step.id)) {
            throw new Error(`Game-flow config ${config.id} repeats step ${step.id}`);
        }
        if (!step.mechanicId || !mechanics[step.mechanicId]) {
            throw new Error(
                `Game-flow step ${step.id} references unknown mechanic ${step.mechanicId}`
            );
        }
        if (
            step.activation &&
            step.activation !== AUTOMATIC_ACTIVATION &&
            step.activation !== MANUAL_ACTIVATION
        ) {
            throw new Error(
                `Game-flow step ${step.id} has invalid activation ${step.activation}`
            );
        }
        if (
            step.activationDelayMs !== undefined &&
            (!Number.isFinite(step.activationDelayMs) ||
                step.activationDelayMs < 0)
        ) {
            throw new Error(
                `Game-flow step ${step.id} needs a non-negative activationDelayMs`
            );
        }
        stepById.set(step.id, step);
    });

    if (!stepById.has(config.startStepId)) {
        throw new Error(
            `Game-flow config ${config.id} has unknown start step ${config.startStepId}`
        );
    }

    config.steps.forEach((step) => {
        const mechanic = mechanics[step.mechanicId];
        if (step.nextStepId && !stepById.has(step.nextStepId)) {
            throw new Error(
                `Game-flow step ${step.id} links to unknown step ${step.nextStepId}`
            );
        }
        if (step.nextStepId && typeof mechanic.onComplete !== "function") {
            throw new Error(
                `Game-flow mechanic ${step.mechanicId} needs onComplete() for step ${step.id}`
            );
        }
        if (
            step.preactivateNextOnBeforeComplete &&
            typeof mechanic.onBeforeComplete !== "function"
        ) {
            throw new Error(
                `Game-flow mechanic ${step.mechanicId} needs onBeforeComplete() for step ${step.id}`
            );
        }
    });

    const visited = new Set();
    let cursor = config.startStepId;
    while (cursor) {
        if (visited.has(cursor)) {
            throw new Error(
                `Game-flow config ${config.id} contains a cycle at step ${cursor}`
            );
        }
        visited.add(cursor);
        cursor = stepById.get(cursor).nextStepId;
    }
    if (visited.size !== config.steps.length) {
        const unreachable = config.steps
            .filter((step) => !visited.has(step.id))
            .map((step) => step.id)
            .join(", ");
        throw new Error(
            `Game-flow config ${config.id} has unreachable steps: ${unreachable}`
        );
    }

    return stepById;
}

export function createMechanicGroup(systems, { id = "mechanic-group" } = {}) {
    if (!Array.isArray(systems)) {
        throw new Error(`Mechanic group ${id} needs an array of systems`);
    }

    const completionListeners = new Set();
    let completionNotified = false;
    const isComplete = () =>
        systems.every((system) => system.isComplete?.() === true);
    const notifyIfComplete = () => {
        if (completionNotified || !isComplete()) return;
        completionNotified = true;
        completionListeners.forEach((listener) => listener());
    };

    systems.forEach((system, index) => {
        if (typeof system.activate !== "function") {
            throw new Error(`Mechanic group ${id} system ${index} needs activate()`);
        }
        if (typeof system.onComplete !== "function") {
            throw new Error(`Mechanic group ${id} system ${index} needs onComplete()`);
        }
        system.onComplete(notifyIfComplete);
    });

    return {
        activate() {
            systems.forEach((system) => system.activate());
            notifyIfComplete();
        },
        deactivate() {
            systems.forEach((system) => system.deactivate?.());
        },
        onComplete(listener) {
            completionListeners.add(listener);
            return () => completionListeners.delete(listener);
        },
        isComplete,
        isBlocking: () =>
            systems.some(
                (system) => system.isBlocking?.() || system.isOpen?.()
            ),
    };
}

export function setupGameFlow({
    config,
    mechanics,
    additionalBlockingChecks = [],
}) {
    const stepById = validateFlowConfig(config, mechanics);
    const completionUnsubscribers = [];
    const preactivatedStepIds = new Set();
    const stepChangeListeners = new Set();
    let currentStep = null;
    let hasStarted = false;

    const activateStepMechanic = (step, isPreactivation = false) => {
        if (step.activation === MANUAL_ACTIVATION) return;
        if (!isPreactivation && preactivatedStepIds.delete(step.id)) return;

        if (isPreactivation) preactivatedStepIds.add(step.id);
        mechanics[step.mechanicId].activate?.(step.activationDelayMs ?? 0);
    };

    const preactivateNextStep = (step) => {
        if (!step.nextStepId || currentStep?.id !== step.id) return;
        const nextStep = stepById.get(step.nextStepId);
        activateStepMechanic(nextStep, true);
    };

    const transitionTo = (stepId) => {
        const nextStep = stepById.get(stepId);
        if (!nextStep) {
            throw new Error(`Cannot transition to unknown game-flow step ${stepId}`);
        }
        if (currentStep?.id === stepId) return;
        if (
            currentStep &&
            currentStep.nextStepId !== stepId
        ) {
            throw new Error(
                `Invalid game-flow transition: ${currentStep.id} → ${stepId}`
            );
        }

        if (currentStep) {
            mechanics[currentStep.mechanicId].deactivate?.();
        }
        currentStep = nextStep;
        activateStepMechanic(currentStep);
        stepChangeListeners.forEach((listener) => listener(currentStep));

        const enteredStep = currentStep;
        const mechanic = mechanics[enteredStep.mechanicId];
        if (
            enteredStep.nextStepId &&
            mechanic.isComplete?.() === true
        ) {
            queueMicrotask(() => {
                if (currentStep?.id === enteredStep.id) {
                    transitionTo(enteredStep.nextStepId);
                }
            });
        }
    };

    config.steps.forEach((step) => {
        const mechanic = mechanics[step.mechanicId];
        if (step.nextStepId) {
            completionUnsubscribers.push(
                mechanic.onComplete(() => {
                    queueMicrotask(() => {
                        if (currentStep?.id === step.id) {
                            transitionTo(step.nextStepId);
                        }
                    });
                })
            );
        }
        if (step.preactivateNextOnBeforeComplete) {
            completionUnsubscribers.push(
                mechanic.onBeforeComplete(() => preactivateNextStep(step))
            );
        }
    });

    return {
        start() {
            if (hasStarted) return;
            hasStarted = true;
            transitionTo(config.startStepId);
        },
        getStepId: () => currentStep?.id ?? null,
        getStep: () => currentStep,
        isStarted: () => hasStarted,
        isStep: (stepId) => currentStep?.id === stepId,
        isMovementPaused: () => {
            if (!hasStarted || !currentStep) return true;
            const mechanic = mechanics[currentStep.mechanicId];
            return Boolean(
                currentStep.pauseMovement ||
                mechanic.isBlocking?.() ||
                additionalBlockingChecks.some((check) => check())
            );
        },
        onStepChange(listener) {
            stepChangeListeners.add(listener);
            return () => stepChangeListeners.delete(listener);
        },
        dispose() {
            completionUnsubscribers.forEach((unsubscribe) => unsubscribe?.());
            stepChangeListeners.clear();
        },
    };
}

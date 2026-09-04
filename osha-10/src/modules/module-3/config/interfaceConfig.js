const publicAssetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

export const interfaceConfig = Object.freeze({
    startScreen: Object.freeze({
        title: "Game Module III",
        loadingLabel: "Loading game…",
        readyLabel: "Start",
        background: Object.freeze({
            src: publicAssetUrl("2D%20Assets/Background.jpg"),
            alt: "",
        }),
        partnerLabel: "Project partners",
        logos: Object.freeze([
            Object.freeze({
                src: publicAssetUrl("2D%20Assets/Vocaxion_logo.png"),
                alt: "Vocaxion",
                width: 668,
                height: 185,
            }),
            Object.freeze({
                src: publicAssetUrl("2D%20Assets/WorkInRoads_logo.png"),
                alt: "Work in Roads",
                width: 300,
                height: 108,
            }),
        ]),
    }),
    mainInterface: Object.freeze({
        placeholder: Object.freeze({
            eyebrow: "MODULE SCAFFOLD",
            title: "Game Module III",
            description: "This module entry is ready for its scene, configuration, and game flow.",
        }),
        stats: Object.freeze({
            timerLabel: "Elapsed game time",
            scoreLabel: "Current score",
            timerIcon: "⏱",
            scoreIcon: "★",
            initialTime: "00:00",
            initialScore: 0,
        }),
        controls: Object.freeze({
            ariaLabel: "Game instructions",
            eyebrow: "OSHA TRAINING SITE",
            title: "Controls",
            closeSymbol: "×",
            closeLabel: "Hide instructions",
            showLabel: "Controls",
            helpIcon: "?",
            shortcutKey: "H",
            shortcutHelp: " hides or shows this guide",
            keySeparator: "or",
            rows: Object.freeze([
                Object.freeze({ keyGroups: Object.freeze([Object.freeze(["W", "S"]), Object.freeze(["↑ ↓"])]), action: "Move" }),
                Object.freeze({ keyGroups: Object.freeze([Object.freeze(["A", "D"]), Object.freeze(["← →"])]), action: "Turn" }),
                Object.freeze({ keyGroups: Object.freeze([Object.freeze(["Space"])]), action: "Jump" }),
            ]),
        }),
        mentor: Object.freeze({
            ariaLabel: "Mentor instructions",
            avatar: "M",
            role: "SITE SAFETY MENTOR",
            name: "Jordan",
            message: "Module III is ready for development.",
            collapseLabel: "Collapse",
            expandLabel: "Expand",
            collapseAriaLabel: "Collapse mentor instructions",
            expandAriaLabel: "Expand mentor instructions",
            chevron: "⌄",
        }),
        completion: Object.freeze({
            icon: "✓",
            eyebrow: "MODULE COMPLETE",
            title: "Congratulations!",
            description: "You completed Game Module III.",
            scoreLabel: "Final score",
            exitLabel: "Exit",
        }),
    }),
});

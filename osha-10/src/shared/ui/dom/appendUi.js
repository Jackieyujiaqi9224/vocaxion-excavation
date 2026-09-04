export function appendUi(root, markup) {
    if (!root) throw new Error("A UI mount element is required");
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    root.append(template.content);
}

export function requireUiElement(id) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Missing required interface element #${id}`);
    return element;
}

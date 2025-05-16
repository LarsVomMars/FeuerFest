import type { ActionReturn } from "svelte/action";

export const longpress = (
    node: HTMLElement,
    duration = 500,
): ActionReturn<number, LongPressEvent> => {
    let timeout: NodeJS.Timeout;

    const activate = () => {
        timeout = setTimeout(
            () => node.dispatchEvent(new CustomEvent("longpress")),
            duration,
        );
    };
    const deactivate = () => clearTimeout(timeout);

    node.addEventListener("mousedown", activate);
    node.addEventListener("touchstart", activate);
    node.addEventListener("mouseup", deactivate);
    node.addEventListener("touchend", deactivate);
    node.addEventListener("touchcancel", deactivate);

    return {
        update(newDuration: number) {
            duration = newDuration;
        },
        destroy() {
            clearTimeout(timeout);
            node.removeEventListener("mousedown", activate);
            node.removeEventListener("touchstart", activate);
            node.removeEventListener("mouseup", deactivate);
            node.removeEventListener("touchend", deactivate);
            node.removeEventListener("touchcancel", deactivate);
        },
    };
};

export interface LongPressEvent {
    onlongpress: (event: CustomEvent<boolean>) => void;
}

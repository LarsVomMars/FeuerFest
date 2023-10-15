const longpress = (node: HTMLElement, duration: number) => {
    let timer: NodeJS.Timeout | null = null;
    const start = () => {
        timer = setTimeout(
            () => node.dispatchEvent(new CustomEvent("longpress")),
            duration,
        );
    };
    const stop = () => {
        if (timer) clearTimeout(timer);
    };
    node.addEventListener("mousedown", start);
    node.addEventListener("touchstart", start);
    node.addEventListener("click", stop);
    node.addEventListener("mouseout", stop);
    node.addEventListener("touchend", stop);
    node.addEventListener("touchcancel", stop);
};

export default longpress;

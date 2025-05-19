import { Maskito } from "@maskito/core";
import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import type { Attachment } from "svelte/attachments";

export const euroMask: Attachment = (node: Element) => {
    const mask = maskitoNumberOptionsGenerator({
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        decimalSeparator: ".",
        min: 0,
        postfix: "€",
    });
    const masked = new Maskito(node as HTMLInputElement, mask);
    return () => masked.destroy;
};

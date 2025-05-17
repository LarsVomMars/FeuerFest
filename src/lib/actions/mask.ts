import { Maskito } from "@maskito/core";
import { maskitoNumberOptionsGenerator } from "@maskito/kit";
import type { Attachment } from "svelte/attachments";

export const mask: Attachment = (node: Element) => {
    const mask = maskitoNumberOptionsGenerator({
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        decimalSeparator: ".",
        min: 0,
        prefix: "€",
    });
    const masked = new Maskito(node as HTMLInputElement, mask);
    return () => masked.destroy;
};

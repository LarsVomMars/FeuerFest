import { EditTextCell } from "$lib/components/table";
import type { ComponentType } from "svelte";

export const getEditableCell = (component: ComponentType): ComponentType => {
    if (component.name.startsWith("Editable")) return component;
    switch (component.name) {
        case "TextCell":
            return EditTextCell;
        default:
            return EditTextCell;
    }
};

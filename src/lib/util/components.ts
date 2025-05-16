import {
    EditColorCell,
    EditNumberCell,
    EditSelectCell,
    EditTextCell,
} from "$lib/components/table";
import type { Component } from "svelte";

export const getEditableCell = (component: Component) => {
    console.log("getEditableCell", component.name);
    if (component.name.startsWith("Edit")) return component;
    switch (component.name) {
        case "TextCell":
            return EditTextCell;
        case "NumberCell":
            return EditNumberCell;
        case "SelectCell":
            return EditSelectCell;
        case "ColorCell":
            return EditColorCell;
        default:
            return EditTextCell;
    }
};

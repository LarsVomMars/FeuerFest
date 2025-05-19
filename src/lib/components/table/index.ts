export type Column = {
    key: string;
    label: string;
    sortable?: boolean;
};

export { default } from "./Table.svelte";
export * from "./cells";

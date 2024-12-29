/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component, ComponentProps } from "svelte";

export type Cell<T, C extends Component<any>> = {
    component: C;
    props?: (row?: T) => Omit<ComponentProps<C>, "value">;
};

export type Column<T, C extends Component<any> = Component<any>> = {
    key: string;
    label: string;
    cell: Cell<T, C>;
};

export const columnBuilder = <T, C extends Component<any>>(
    key: string,
    label: string,
    component: C,
    props?: (row?: T) => Omit<ComponentProps<C>, "value">,
): Column<T, C> => ({ key, label, cell: { component, props } });

export { default } from "./Table.svelte";
export * from "./cells";

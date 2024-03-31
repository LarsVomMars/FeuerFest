import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";

export type Cell<T, C extends SvelteComponent = SvelteComponent> = {
    component: ComponentType<C>;
    props?: (row: T) => Omit<ComponentProps<C>, "value">;
};

export type Column<T, C extends SvelteComponent = SvelteComponent> = {
    key: string;
    label: string;
    cell: Cell<T, C>;
};

export const columnBuilder = <T, C extends SvelteComponent = SvelteComponent>(
    key: string,
    label: string,
    cell: Cell<T, C>,
): Column<T, C> => ({ key, label, cell });

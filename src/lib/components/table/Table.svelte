<script lang="ts" generics="T extends Record<string, unknown>">
    import type { Snippet } from "svelte";
    import type { Column } from ".";

    import PaginationControl from "./PaginationControl.svelte";

    interface Props<T extends Record<string, unknown>> {
        rows: T[];
        columns: Column[];
        render: Snippet<[T]>;
        class?: string;
    }

    let page = $state(0);
    let size = $state(10);

    let { rows, columns, render, class: tableClass }: Props<T> = $props();

    let currentRows = $derived(rows.slice(page * size, (page + 1) * size));
</script>

<table class={tableClass}>
    <thead>
        <tr>
            {#each columns as { label, key } (key)}
                <th class="select-none">{label}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each currentRows as row}
            <tr>
                {@render render?.(row)}
            </tr>
        {/each}
    </tbody>
</table>
<PaginationControl bind:page bind:size total={rows.length} />

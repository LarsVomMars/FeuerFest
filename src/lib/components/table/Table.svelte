<script lang="ts">
    import type { Column } from ".";

    import PaginationControl from "./PaginationControl.svelte";

    interface Props<T extends Record<string, any>> {
        rows: T[];
        columns: Column<T>[];
    }

    let page = $state(0);
    let size = $state(20);

    export type T = $$Generic<Record<string, any>>;

    let { rows, columns }: Props<T> = $props();

    let currentRows = $derived(rows.slice(page * size, (page + 1) * size));
</script>

<table class="table-auto">
    <thead>
        <tr>
            {#each columns as { label }}
                <th>{label}</th>
            {/each}
        </tr>
    </thead>
    <tbody>
        {#each currentRows as row}
            <tr>
                {#each columns as { key, cell }}
                    {@const props = cell.props ? cell.props(row) : []}
                    <td>
                        <svelte:component
                            this={cell.component}
                            value={row[key]}
                            {...props}
                        />
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
<PaginationControl bind:page bind:size total={rows.length} />

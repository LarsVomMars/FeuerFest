<script lang="ts">
    import { getEditableCell } from "$lib/util/components";
    import type { Column } from ".";

    import PaginationControl from "./PaginationControl.svelte";

    interface Props<T extends Record<string, any>> {
        rows: T[];
        columns: Column<T>[];
        add?: (data: Record<string, any>) => void;
    }

    let page = $state(0);
    let size = $state(20);

    export type T = $$Generic<Record<string, any>>;

    let { rows, columns, add }: Props<T> = $props();

    let currentRows = $derived(rows.slice(page * size, (page + 1) * size));
    let data: Record<string, any> = $state(
        columns.reduce((acc, { key }) => ({ ...acc, [key]: undefined }), {}),
    );
</script>

<table class="table-auto w-full">
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
                    <td class="p-2">
                        <svelte:component
                            this={cell.component}
                            value={row[key]}
                            {...cell.props?.(row) ?? []}
                        />
                    </td>
                {/each}
            </tr>
        {/each}
    </tbody>
    {#if add}
        <tfoot>
            <tr>
                {#each columns.filter((c) => c.label !== "") as { key, cell }}
                    <td class="p-2">
                        <svelte:component
                            this={getEditableCell(cell.component)}
                            bind:value={data[key]}
                            {...cell.props?.() ?? []}
                            edit={true}
                        />
                    </td>
                {/each}
                <td>
                    <button
                        on:click={() => {
                            add!(data);
                            data = {};
                        }}
                    >
                        Neu
                    </button>
                </td>
            </tr>
        </tfoot>
    {/if}
</table>
<PaginationControl bind:page bind:size total={rows.length} />

<script lang="ts" generics="T extends Record<string, any>">
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
                    {@const Component = cell.component}
                    <td class="p-2">
                        <Component
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
                    {@const Component = getEditableCell(cell.component)}
                    <td class="p-2">
                        <Component
                            {...cell.props?.() ?? []}
                            value={data[key]}
                            update={(value) => (data[key] = value)}
                            edit={true}
                        />
                    </td>
                {/each}
                <td>
                    <button
                        onclick={() => {
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

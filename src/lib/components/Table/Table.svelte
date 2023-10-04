<script lang="ts">
    import { writable } from "svelte/store";

    import {
        getCoreRowModel,
        type ColumnDef,
        type TableOptions,
        createSvelteTable,
        flexRender,
    } from "@tanstack/svelte-table";

    import PaginationControl from "./PaginationControl.svelte";

    // eslint-disable-next-line no-undef
    export type T = $$Generic;

    export let columns: ColumnDef<T>[];
    export let rows: T[];

    export let paginate = true;
    export let page = 0;
    export let pageSize = 10;

    const pagination = <T,>(items: T[], pageSize: number, page: number) => {
        const start = page * pageSize;
        const end = start + pageSize;
        return items.slice(start, end);
    };

    $: data = paginate ? pagination(rows, pageSize, page) : rows;
    $: options = writable<TableOptions<T>>({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });

    $: table = createSvelteTable($options);

    let classes = "";
    export { classes as class };
</script>

<div class={classes}>
    <table class="w-full">
        <thead>
            {#each $table.getHeaderGroups() as headerGroup}
                <tr>
                    {#each headerGroup.headers as header}
                        <th>
                            {#if !header.isPlaceholder}
                                <svelte:component
                                    this={flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                />
                            {/if}
                        </th>
                    {/each}
                </tr>
            {/each}
        </thead>
        <tbody>
            {#each $table.getRowModel().rows as row}
                <tr>
                    {#each row.getVisibleCells() as cell}
                        <td>
                            <svelte:component
                                this={flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            />
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <slot />
        </tfoot>
    </table>
    {#if paginate}
        <PaginationControl bind:page bind:pageSize total={rows.length} />
    {/if}
</div>

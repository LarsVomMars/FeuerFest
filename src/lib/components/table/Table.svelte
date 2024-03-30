<script lang="ts">
    import PaginationControl from "./PaginationControl.svelte";

    interface Props<T> {
        rows: T[];
        columns: { key: keyof T; label: string }[];
    }

    let page = $state(0);
    let size = $state(20);

    export type T = $$Generic;

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
                {#each columns as { key }}
                    <td>{row[key]}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>
<PaginationControl bind:page={page} bind:size={size} total={rows.length} />

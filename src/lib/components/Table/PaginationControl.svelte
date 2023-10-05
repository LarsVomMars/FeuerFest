<script lang="ts">
    export let page: number;
    export let pageSize: number;
    export let total: number;

    let currentPage = page + 1;

    $: pages = Math.ceil(total / pageSize);
    $: page = currentPage - 1;
    $: currentPage = Math.max(1, Math.min(pages, currentPage));
</script>

<div class="flex flex-row justify-center gap-x-2">
    <button on:click={() => (currentPage = 1)} disabled={currentPage === 1}>
        {"<<"}
    </button>
    <button
        on:click={() => (currentPage = Math.max(0, currentPage - 1))}
        disabled={page === 0}
    >
        {"<"}
    </button>
    <input
        class="bg-transparent text-right w-10"
        bind:value={currentPage}
        min={1}
        max={pages}
    />
    <span>/</span>
    <span>{pages}</span>
    <button
        on:click={() => (currentPage = Math.min(pages, currentPage + 1))}
        disabled={currentPage === pages}
    >
        {">"}
    </button>
    <button
        on:click={() => (currentPage = pages)}
        disabled={currentPage === pages}
    >
        {">>"}
    </button>

    <select bind:value={pageSize} class="bg-transparent text-right w-15">
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
    </select>
</div>

<script lang="ts">
    type Props = {
        page: number;
        size: number;
        total: number;
    };

    let { page, size, total }: Props = $props();

    let pages = $derived(Math.ceil(total / size));
</script>

<div class="flex justify-center space-x-2">
    {#if page > 0}
        <button on:click={() => page--}>Previous</button>
    {/if}

    {#each Array.from({ length: pages }).map((_, i) => i) as $i}
        {#if $i <= page + 3 && $i >= page - 3}
            <button class:font-bold={$i === page} on:click={() => (page = $i)}>
                {$i + 1}
            </button>
        {/if}
    {/each}

    {#if page < pages - 1}
        <button on:click={() => page++}>Next</button>
    {/if}
</div>

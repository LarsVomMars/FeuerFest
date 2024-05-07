<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });

    let event = $eventRequest.data?.Event;
</script>

<Heading title={event?.name + " - Kasse"} />

{#if $productRequest.data}
    {#each $productRequest.data as product}
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <button>Kaufen</button>
        </div>
    {/each}
{/if}
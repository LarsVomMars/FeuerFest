<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";

    import MultiDropdown, {
        type Option,
    } from "$lib/components/MultiDropdown.svelte";
    import Card from "./Card.svelte";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });

    let event = $eventRequest.data?.Event;

    let options = [
        { value: "DRINK", name: "Drinken" },
        { value: "FOOD", name: "Essen" },
        { value: "BAR", name: "Bar" },
    ];

    let selected = $state<Option[]>([]);

    let products = $productRequest.data ?? [];
    type Product = (typeof products)[number];

    let availableProducts = $derived(
        products.filter((p) => selected.some((s) => s.value === p.type)),
    );

    const onclick = (product: Product) => () => {
        order = [...order, product];
    };

    let order = $state<Product[]>([]);
    let uniqueOrder = $derived(new Set(order));
    let items = $derived(
        [...uniqueOrder].map((item) => ({
            ...item,
            count: order.filter((i) => i === item).length,
        })),
    );
    let total = $derived(order.reduce((acc, item) => +acc + +item.price, 0).toFixed(2));
</script>

<Heading title={event?.name + " - Kasse"} />
<div class="w-full flex">
    <div class="w-1/5 p-2">
        <MultiDropdown bind:selected {options} start={options} />
        <table class="w-full">
            <tbody>
                {#each items as item}
                    <tr>
                        <td>{item.count}x</td>
                        <td>{item.name}</td>
                        <td class="text-right">{item.price}€</td>
                    </tr>
                {/each}
            </tbody>
            {#if items.length}
                <tfoot>
                    <tr class="border-t">
                        <td colspan={2}>Gesamt</td>
                        <td class="text-right">{total}€</td>
                    </tr>
                </tfoot>
            {/if}
        </table>
    </div>
    <div class="w-4/5 p-2 flex h-full items-center flex-wrap justify-center">
        {#each availableProducts as product}
            <Card {...product} onclick={onclick(product)} />
        {/each}
    </div>
</div>

<script lang="ts">
    import { page } from "$app/stores";
    import { ProductType } from "$lib/db/types";
    import { trpc } from "$lib/trpc";

    const event = $page.params.slug!;
    const productsRequest = trpc.events.products.list.query({ event });

    let filter: ProductType[] = [
        ProductType.FOOD,
        ProductType.DRINK,
        ProductType.BAR,
    ];

    const typeOptions = [
        { value: ProductType.FOOD, label: "Essen" },
        { value: ProductType.DRINK, label: "Getränke" },
        { value: ProductType.BAR, label: "Bar" },
    ];

    $: products =
        $productsRequest.data?.filter((p) =>
            filter.includes(p.type as ProductType),
        ) ?? [];
</script>

<h2 class="font-bold text-2xl">Bestellen</h2>

<div class="w-1/5">
    <select bind:value={filter} class="bg-transparent w-full" multiple>
        {#each typeOptions as option}
            <option
                value={option.value}
                class="checked:bg-ffgreen-dark checked:text-white [&:not(:checked)]:bg-ffred-dimmed text-center"
            >
                {option.label}
            </option>
        {/each}
    </select>
</div>

<div class="flex flex-row w-full flex-wrap justify-evenly gap-4">
    {#each products as product}
        <div
            class="w-1/5 p-4 h-30 rounded-lg text-center border-2 border-ffred"
        >
            <div>{product.name}</div>
            <div>{product.description}</div>
            <div>{product.price}</div>
        </div>
    {/each}
</div>

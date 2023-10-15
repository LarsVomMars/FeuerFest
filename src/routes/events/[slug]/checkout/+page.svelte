<script lang="ts">
    import { page } from "$app/stores";
    import Dialog from "$lib/components/Dialog.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import LabeledToggle from "$lib/components/Form/Input/LabeledToggle.svelte";
    import { ProductType } from "$lib/db/types";
    import { trpc } from "$lib/trpc";
    import Card from "./Card.svelte";
    import ProductCard from "./ProductCard.svelte";

    const event = $page.params.slug!;
    const productsRequest = trpc.events.products.list.query({ event });
    const orderRequest = trpc.events.checkout.order.mutation({
        onSuccess: () => {
            $productsRequest.refetch();
            order = [];
            received = "";
            voucher = false;
        },
    });

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

    type Product = (typeof products)[0];

    let order: Product[] = [];
    $: uniqueOrder = new Set(order);
    $: amounts = new Map(
        [...uniqueOrder].map((p) => [p, order.filter((o) => o === p).length]),
    );
    $: total = order.reduce((acc, p) => acc + Number(p.price), 0);

    const addToOrder = (product: Product) => () =>
        (order = [...order, product]);

    const clearOrder = () => (order = []);
    const removeFromOrder = (product: Product) => () => {
        const index = order.indexOf(product);
        if (index > -1) {
            order.splice(index, 1);
            order = order;
        }
    };

    let voucher = false;
    const makeOrder = () => {
        const order = [...amounts].map(([item, quantity]) => ({
            id: item.id,
            quantity,
            total: Number(item.price) * quantity,
        }));
        dialog.close();
        $orderRequest.mutate({ event, order, voucher });
    };

    let custom: string;
    $: customProduct = {
        id: -1,
        name: "Sonstiges",
        price: Number(custom).toFixed(2),
    } as Product;

    let dialog: HTMLDialogElement;
    let received: string;
    $: change = ((Number(received) || 0) - total).toFixed();
</script>

<h2 class="font-bold text-2xl">Bestellen</h2>

<div class="w-1/6 absolute right-4 top-20">
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

<div class="w-full flex flex-row flex-wrap">
    <div class="w-1/5 text-center select-none p-2 space-y-2">
        <h2 class="font-bold text-xl">Bestellung</h2>
        <table class="w-full h-auto">
            {#each amounts as [item, amount]}
                <tr>
                    <td class="text-right w-[30%]">{amount}x</td>
                    <td class="text-left w-[60%]">{item.name}</td>
                    <td class="text-center w-[10%]">
                        <button on:click={removeFromOrder(item)}>
                            <img
                                src="/icons/trash.svg"
                                alt="trash"
                                class="w-4"
                            />
                        </button>
                    </td>
                </tr>
            {/each}
        </table>
        <div>Gesamt: {total.toFixed(2)}€</div>
        <button
            class="w-2/3 bg-ffgreen rounded-md p-2"
            on:click={() => order.length && dialog.showModal()}
        >
            Bestellen
        </button>
        <button class="w-2/3 bg-ffred rounded-md p-2" on:click={clearOrder}>
            Abbrechen
        </button>
    </div>
    <div class="flex flex-row flex-wrap justify-evenly gap-4 w-4/5">
        {#each products as product}
            <ProductCard
                name={product.name}
                description={product.description}
                price={product.price}
                action={addToOrder(product)}
            />
        {/each}
        <Card
            action={() => {
                if (!+custom || +custom < 0) return;
                addToOrder(customProduct)();
                custom = "";
            }}
            self={true}
        >
            <h2 class="font-bold text-xl">Sonstiges</h2>
            <input
                type="number"
                class="w-full rounded-lg border-2 border-ffdark bg-transparent p-2 focus:outline-none"
                bind:value={custom}
            />
        </Card>
    </div>
</div>

<Dialog
    bind:dialog
    class="bg-ffdark w-1/2 h-1/2 text-white flex flex-col justify-center items-center [&:not([open])]:hidden gap-4"
>
    <span class="font-bold">Gesamt: {total}€</span>
    <div class="w-1/2">
        <LabeledInput label="Bekommen" bind:value={received} type="number" />
    </div>
    <span class="font-bold">Rückgeld: {change}€</span>

    <div class="w-1/2">
        <LabeledToggle label="Gutschein" bind:checked={voucher} />
    </div>

    <button
        class="w-1/2 rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed"
        on:click={makeOrder}
    >
        Bestellen
    </button>
    <button
        class="w-1/2 rounded-lg bg-ffred p-2 hover:bg-ffred-dimmed"
        on:click={() => {
            dialog.close();
            received = "";
            voucher = false;
        }}
    >
        Abbrechen
    </button>
</Dialog>

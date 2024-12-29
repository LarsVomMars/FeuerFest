<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";

    import MultiDropdown, {
        type Option,
    } from "$lib/components/MultiDropdown.svelte";
    import Card from "./Card.svelte";
    import NumberInput from "$lib/components/form/inputs/NumberInput.svelte";
    import ToggleButton from "$lib/components/form/inputs/ToggleButton.svelte";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });
    const orderRequest = trpc.events.checkout.checkout.mutation({
        onSuccess: () => {
            order = [];
        },
        onError: console.error,
    });

    let event = $eventRequest.data?.Event;

    const options = [
        { value: "DRINK", name: "Trinken" },
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
    let total = $derived(order.reduce((acc, item) => +acc + +item.price, 0));

    let value = $state<number>();
    const addCustomItem = () => {
        if (value === undefined) return;
        order = [
            ...order,
            {
                id: -1,
                name: "Sonstiges",
                description: "",
                price: value,
                type: "FOOD",
                textColor: "black",
                backgroundColor: "white",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 0,
                event: "",
            },
        ];
        value = undefined;
    };

    const orderDialog = () => {
        dialog?.showModal();
    };

    let dialog = $state<HTMLDialogElement>();
    let received = $state<number>();
    let change = $derived((received || 0) - total);
    let voucher = $state<boolean>(false);

    const makeOrder = () => {
        $orderRequest.mutate({
            event: slug,
            voucher,
            order: items.map((i) => ({
                id: i.id,
                price: +i.price,
                quantity: i.count,
                total: +i.price * i.count,
            })),
        });
        closeDialog();
    };
    const closeDialog = () => {
        dialog?.close();
        voucher = false;
        received = undefined;
    };
</script>

<Heading title={event?.name + " - Kasse"} />
<div class="w-full flex">
    <div class="w-1/5 p-2 space-y-2">
        <MultiDropdown bind:selected {options} start={options} />
        <table class="w-full">
            <tbody>
                {#each items as item}
                    <tr>
                        <td>{item.count}x</td>
                        <td>{item.name}</td>
                        <td class="text-right">
                            {item.price.toFixed
                                ? item.price.toFixed(2)
                                : item.price}€
                        </td>
                    </tr>
                {/each}
            </tbody>
            {#if items.length}
                <tfoot>
                    <tr class="border-t">
                        <td colspan={2}>Gesamt</td>
                        <td class="text-right">{total.toFixed(2)}€</td>
                    </tr>
                </tfoot>
            {/if}
        </table>
        {#if items.length}
            <button
                type="submit"
                class="w-full rounded-lg bg-secondary p-2 hover:bg-secondary-200 disabled:bg-secondary-300 text-white"
                onclick={orderDialog}
            >
                Bestellen
            </button>
        {/if}
    </div>
    <div class="w-4/5 p-2 flex h-full items-center flex-wrap justify-center">
        {#each availableProducts as product}
            <Card {...product} onclick={onclick(product)} />
        {/each}
        <button
            class="w-1/5 rounded-lg m-2 p-2 h-32 shadow-md text-white bg-secondary"
            onclick={addCustomItem}
        >
            <h2 class="text-2xl font-bold">Sonstiges</h2>
            <br />
            <NumberInput label="" bind:value />
        </button>
    </div>
</div>

<dialog
    bind:this={dialog}
    class="border dark:bg-dark dark:text-white w-1/2 h-1/2 flex flex-col justify-center [&:not([open])]:hidden gap-4 items-center"
>
    <span>Gesamt: {total.toFixed(2)}€</span>
    <div class="w-1/2">
        <NumberInput label="Bekommen" bind:value={received} />
    </div>
    <span>Rückgeld: {change.toFixed(2)}€</span>
    <div class="w-1/2">
        <ToggleButton bind:checked={voucher} label="Gutschein" />
    </div>

    <button
        class="w-1/2 rounded-md p-2 text-white bg-secondary"
        onclick={makeOrder}
    >
        Bestellen
    </button>
    <button
        class="w-1/2 rounded-md p-2 text-white bg-primary"
        onclick={closeDialog}
    >
        Abrechen
    </button>
</dialog>

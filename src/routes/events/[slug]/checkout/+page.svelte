<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";

    import Card from "./Card.svelte";
    import NumberInput from "$lib/components/form/inputs/NumberInput.svelte";
    import ToggleButton from "$lib/components/form/inputs/ToggleButton.svelte";
    import Form from "$lib/components/form";
    import SubmitButton from "$lib/components/form/inputs/SubmitButton.svelte";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });
    const orderRequest = trpc.events.checkout.checkout.mutation({
        onSuccess: () => {
            order = [];
            $productRequest.refetch();
        },
        onError: console.error,
    });

    let event = $eventRequest.data?.Event;

    const options = [
        { value: "DRINK", name: "Trinken" },
        { value: "FOOD", name: "Essen" },
        { value: "BAR", name: "Bar" },
    ];

    let selected = $state<string>("FOOD");

    let products = $productRequest.data ?? [];
    type Product = (typeof products)[number];
    type ProductWithCount = Product & { count: number };

    let availableProducts = $derived(
        products.filter((p) => selected === p.type && p.enabled),
    );

    const onclick = (product: Product) => (count: number) => {
        order = [...order, ...Array(count).fill(product)];
    };

    let order = $state<Product[]>([]);
    let items = $derived(
        order.reduce((acc, item) => {
            const existingItem = acc.find((i) => i.id === item.id);
            if (existingItem) {
                existingItem.count++;
                if (existingItem.id === -1) existingItem.price += item.price;
            } else {
                acc.push({ ...item, count: 1 });
            }
            return acc;
        }, [] as ProductWithCount[]),
    );
    let total = $derived(order.reduce((acc, item) => acc + item.price, 0));

    let value = $state<number>();
    let cid = $state(-1);
    const addCustomItem = (event?: Event) => {
        event?.preventDefault();
        if (value === undefined) return;
        order = [
            ...order,
            {
                id: cid--,
                name: "Sonstiges",
                description: "",
                price: value,
                type: selected as "DRINK" | "FOOD" | "BAR",
                textColor: "black",
                backgroundColor: "white",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: 0,
                event: slug,
                enabled: true,
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
                price: i.price,
                quantity: i.count,
                total: i.price * i.count,
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

<div
    class="border-primary fixed top-5 left-5 flex items-center justify-center border-2 p-2"
>
    <ul>
        {#each options as option (option.value)}
            <li class="select-none">
                <input
                    type="radio"
                    id="cb-{option.value}"
                    bind:group={selected}
                    value={option.value}
                />
                <label for="cb-{option.value}">{option.name}</label>
            </li>
        {/each}
    </ul>
</div>

<!-- <Heading title={event?.name + " - Kasse"} /> -->
<div class="flex w-full">
    <div class="flex w-1/5 flex-col justify-center space-y-2 p-2">
        <table class="w-full">
            <tbody>
                {#each items as item (item.id)}
                    <tr>
                        <td>{item.count.toString()}x</td>
                        <td>{item.name}</td>
                        <td class="text-right">{item.price.toFixed(2)}€</td>
                    </tr>
                {/each}
            </tbody>
            <tfoot>
                <tr class="border-t">
                    <td colspan={2}>Gesamt</td>
                    <td class="text-right">{total.toFixed(2)}€</td>
                </tr>
            </tfoot>
        </table>
        <button
            type="submit"
            class="bg-secondary hover:bg-secondary-200 disabled:bg-secondary-300 w-full cursor-pointer rounded-lg p-2 text-white disabled:cursor-not-allowed"
            onclick={orderDialog}
            disabled={items.length === 0}
        >
            Bestellen
        </button>
        <button
            type="button"
            class="bg-primary hover:bg-primary-200 disabled:bg-primary-300 w-full cursor-pointer rounded-lg p-2 text-white disabled:cursor-not-allowed"
            onclick={() => (order = [])}
            disabled={items.length === 0}
        >
            Abbrechen
        </button>
    </div>
    <div class="flex h-full w-4/5 flex-wrap items-center justify-center p-2">
        {#each availableProducts as product (product.id)}
            <Card {...product} onclick={onclick(product)} />
        {/each}
        <button
            class="bg-secondary m-2 h-32 w-1/5 rounded-lg p-2 text-white shadow-md transition-all duration-200 enabled:hover:scale-105 enabled:hover:shadow-lg"
            onclick={addCustomItem}
            disabled={!value}
        >
            <h2 class="text-2xl font-bold">Sonstiges</h2>
            <br />
            <form onsubmit={addCustomItem}>
                <NumberInput label="" bind:value />
            </form>
        </button>
    </div>
</div>

<dialog
    bind:this={dialog}
    class="dark:bg-dark fixed flex h-1/2 w-1/2 translate-1/2 flex-col items-center justify-center border dark:text-white [&:not([open])]:hidden"
>
    <div class="w-1/2">
        <Form submit={makeOrder}>
            <span>Gesamt: {total.toFixed(2)}€</span>
            <NumberInput label="Bekommen" bind:value={received} />
            <span>Rückgeld: {change.toFixed(2)}€</span>
            <ToggleButton bind:checked={voucher} label="Gutschein" />
            <SubmitButton text="Bestellen" />
            <button
                class="bg-primary hover:bg-primary-200 w-full cursor-pointer rounded-md p-2 text-white"
                type="button"
                onclick={closeDialog}
            >
                Abrechen
            </button>
        </Form>
    </div>
</dialog>

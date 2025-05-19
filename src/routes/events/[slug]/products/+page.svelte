<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc, type RouterInputs, type RouterOutputs } from "$lib/trpc";
    import Table, {
        ColorCell,
        DeleteAction,
        DropDownCell,
        TextCell,
        type Column,
    } from "$lib/components/table";

    import { euroMask } from "$lib/actions/mask";
    import NewProduct from "./NewProduct.svelte";
    import { SvelteMap } from "svelte/reactivity";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });
    const createRequest = trpc.events.products.create.mutation({
        onSuccess: () => $productRequest.refetch(),
    });
    const updateRequest = trpc.events.products.update.mutation({
        onSuccess: () => $productRequest.refetch(),
    });
    const deleteRequest = trpc.events.products.delete.mutation({
        onSuccess: () => $productRequest.refetch(),
    });

    let event = $eventRequest.data?.Event;
    const options = [
        {
            label: "Trinken",
            value: "DRINK",
        },
        {
            label: "Essen",
            value: "FOOD",
        },
        {
            label: "Bar",
            value: "BAR",
        },
    ];

    const add = (
        data: Omit<RouterInputs["events"]["products"]["create"], "slug">,
    ) => {
        $createRequest.mutate({
            slug,
            ...data,
        });
    };

    const columns: Column[] = [
        { label: "Name", key: "name" },
        { label: "Beschreibung", key: "description" },
        { label: "Preis", key: "price" },
        { label: "Art", key: "type" },
        { label: "Textfarbe", key: "textColor" },
        { label: "Hintergrundfarbe", key: "backgroundColor" },
        { label: "", key: "actions" },
    ];

    type Row = RouterOutputs["events"]["products"]["list"][number];

    const update = (
        id: number,
        data: Partial<RouterInputs["events"]["products"]["update"]>,
    ) => {
        $updateRequest.mutate({
            id,
            slug,
            ...data,
        });
    };

    const ondelete = (id: number) => $deleteRequest.mutate({ id, slug });
</script>

{#snippet render(row: Row)}
    <td>
        <TextCell
            value={row.name}
            onchange={(e) => update(row.id, { name: e.currentTarget.value })}
        />
    </td>
    <td>
        <TextCell
            value={row.description}
            onchange={(e) =>
                update(row.id, { description: e.currentTarget.value })}
        />
    </td>
    <td>
        <TextCell
            value={row.price.toFixed(2) + "€"}
            {@attach euroMask}
            onchange={(e) =>
                update(row.id, { price: parseFloat(e.currentTarget.value) })}
        />
    </td>
    <td>
        <DropDownCell
            value={row.type}
            {options}
            onchange={(e) =>
                update(row.id, {
                    type: e.currentTarget.value as "DRINK" | "FOOD" | "BAR",
                })}
        />
    </td>
    <td>
        <ColorCell
            value={row.textColor}
            onchange={(e) =>
                update(row.id, { textColor: e.currentTarget.value })}
        />
    </td>
    <td>
        <ColorCell
            value={row.backgroundColor}
            onchange={(e) =>
                update(row.id, { backgroundColor: e.currentTarget.value })}
        />
    </td>
    <td>
        <DeleteAction ondelete={() => ondelete(row.id)} />
    </td>
{/snippet}

<Heading title={event?.name + " - Produkte"} />

{#if $productRequest.isSuccess}
    <Table
        rows={$productRequest.data}
        {columns}
        {render}
        class="[&_tbody]:border-primary [&_tbody]:border-y [&_td]:p-2 [&_th]:p-2"
    />
{/if}

<NewProduct {add} />

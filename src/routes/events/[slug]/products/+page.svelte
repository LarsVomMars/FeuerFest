<script lang="ts">
    import { page } from "$app/stores";
    import DeleteAction from "$lib/components/Table/Cells/Action/DeleteAction.svelte";
    import EditableNumberCell from "$lib/components/Table/Cells/Number/EditableNumberCell.svelte";
    import EditableTextCell from "$lib/components/Table/Cells/Text/EditableTextCell.svelte";
    import Table from "$lib/components/Table/Table.svelte";
    import { trpc } from "$lib/trpc";
    import { flexRender, type ColumnDef } from "@tanstack/svelte-table";

    const event = $page.params.slug!;

    const productsRequest = trpc.events.products.list.query({ event });
    const createRequest = trpc.events.products.create.mutation({
        onSuccess: () => {
            $productsRequest.refetch();
            name = "";
            description = "";
            price = undefined;
        },
        onError: (err) => console.error(err.message),
    });
    const updateRequest = trpc.events.products.update.mutation({
        onSuccess: () => {
            $productsRequest.refetch();
        },
        onError: (err) => console.error(err.message),
    });
    const deleteRequest = trpc.events.products.delete.mutation({
        onSuccess: () => {
            $productsRequest.refetch();
        },
        onError: (err) => console.error(err.message),
    });

    $: rows = $productsRequest.data ?? [];
    type Product = (typeof rows)[0];

    const columns: ColumnDef<Product>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: (ctx) =>
                flexRender(EditableTextCell, {
                    value: ctx.getValue(),
                    onChange: makeOnChange(ctx.row.original, "name"),
                }),
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Beschreibung",
            cell: (ctx) =>
                flexRender(EditableTextCell, {
                    value: ctx.getValue(),
                    onChange: makeOnChange(ctx.row.original, "description"),
                }),
        },
        {
            id: "price",
            accessorKey: "price",
            header: "Preis",
            cell: (ctx) =>
                flexRender(EditableNumberCell, {
                    value: ctx.getValue(),
                    adornment: "€",
                    onChange: makeOnChange(ctx.row.original, "price"),
                }),
        },
        {
            id: "actions",
            header: "Aktionen",
            cell: (ctx) =>
                flexRender(DeleteAction, {
                    action: makeRemoveAction(ctx.row.original),
                }),
        },
    ];

    let name = "";
    let description = "";
    let price: number | undefined;

    const addProduct = () => {
        if (!name || !description || (price || 0) < 0) return;
        $createRequest.mutate({
            event,
            name,
            description,
            price: price ?? 0,
        });
    };

    const makeOnChange =
        (row: Product, name: "name" | "description" | "price") =>
        (value: string) => {
            console.log(value);
            $updateRequest.mutate({
                id: row.id,
                event,
                [name]: value,
            });
        };

    const makeRemoveAction = (row: Product) => () => {
        $deleteRequest.mutate({ event, id: row.id });
    };
</script>

<h2 class="font-bold text-2xl">Produkte</h2>
<Table {columns} {rows} class="w-1/2">
    <tr class="border-t">
        <td class="w-1/4">
            <div class="w-full">
                <input
                    bind:value={name}
                    class="w-full bg-transparent border-2 border-ffred outline-none"
                />
            </div>
        </td>
        <td class="w-1/4">
            <div class="w-full">
                <input
                    bind:value={description}
                    class="w-full bg-transparent border-2 border-ffred outline-none"
                />
            </div>
        </td>
        <td class="w-1/4">
            <div class="w-full">
                <input
                    bind:value={price}
                    type="number"
                    min={0}
                    step={0.01}
                    class="w-full bg-transparent border-2 border-ffred outline-none"
                />
            </div>
        </td>
        <td class="w-1/4">
            <button on:click={addProduct} class="w-full">Hinzufügen</button>
        </td>
    </tr>
</Table>

<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";
    import Table, {
        EditTextCell,
        EditSelectCell,
        EditNumberCell,
        DeleteAction,
        columnBuilder,
        type Column,
    } from "$lib/components/table";
    import EditColorCell from "$lib/components/table/cells/color/EditColorCell.svelte";
    import {
        ColorInput,
        DropDown,
        NumberInput,
        TextInput,
    } from "$lib/components/form";

    import { mask } from "$lib/actions/mask";
    import Test from "./Test.svelte";

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

    // Prob wait for library update to use runes
    $: rows = $productRequest.data ?? [];

    type Row = (typeof rows)[number];

    // let rows: Row[] = $derived([...products]);

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

    const makeOnChange = <T,>(name: string, row?: Row) =>
        row
            ? (value: T) => {
                  $updateRequest.mutate({
                      slug,
                      id: row.id,
                      [name]: value,
                  });
              }
            : undefined;

    const add = (data: Record<string, any>) => {
        $createRequest.mutate({
            slug,
            name: data.name,
            description: data.description,
            price: +data.price,
            type: data.type,
            backgroundColor: data.backgroundColor,
            textColor: data.textColor,
        });
    };

    const formatter = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
</script>

<Heading title={event?.name + " - Produkte"} />
<!-- <Table {rows} {columns} {add}></Table> -->
<table class="[&_td]:p-2 [&_th]:p-2">
    <thead>
        <tr>
            <th>Name</th>
            <th>Beschreibung</th>
            <th>Preis</th>
            <th>Art</th>
            <th>Textfarbe</th>
            <th>Hintergrundfarbe</th>
            <th></th>
        </tr>
    </thead>
    <tbody class="border-primary border-y">
        {#each rows as row (row.id)}
            <tr>
                <td>
                    <TextInput label="" value={row.name} />
                </td>
                <td>
                    <TextInput label="" value={row.description} />
                </td>
                <td>
                    <TextInput
                        label=""
                        value={formatter.format(row.price).replace(",", ".")}
                        oninput={e => console.log((e.currentTarget as HTMLInputElement).value)}
                        {@attach mask}
                    />
                </td>
                <td>
                    <DropDown label="" value={row.type} {options} />
                </td>
                <td>
                    <ColorInput label="" value={row.textColor} />
                </td>
                <td>
                    <ColorInput label="" value={row.backgroundColor} />
                </td>
                <td>
                    <DeleteAction
                        ondelete={() =>
                            $deleteRequest.mutate({
                                slug,
                                id: row.id,
                            })}
                    />
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";
    import Table, {
        TextCell,
        EditTextCell,
        NumberCell,
        EditSelectCell,
        columnBuilder,
        type Column,
        EditNumberCell,
    } from "$lib/components/table";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });
    const createRequest = trpc.events.products.create.mutation({
        onSuccess: () => $productRequest.refetch(),
    });
    const updateRequest = trpc.events.products.update.mutation({
        onSuccess: () => $productRequest.refetch(),
    });

    let event = $eventRequest.data?.Event;

    // Prob wait for library update to use runes
    $: rows = $productRequest.data ?? [];

    type Row = (typeof rows)[number];

    // let rows: Row[] = $derived([...products]);

    const options = [
        {
            label: "Drinken",
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

    const columns: Column<Row>[] = [
        columnBuilder("name", "Name", {
            component: EditTextCell,
            props: (row) => ({
                update: makeOnChange("name", row),
            }),
        }),
        columnBuilder("description", "Beschreibung", {
            component: EditTextCell,
            props: (row) => ({
                update: makeOnChange("description", row),
            }),
        }),
        columnBuilder("price", "Preis", {
            component: EditNumberCell,
            props: (row) => ({
                update: makeOnChange("price", row),
                adornment: "€",
            }),
        }),
        columnBuilder("type", "Art", {
            component: EditSelectCell,
            props: (row) => ({
                options,
                update: makeOnChange("type", row),
            }),
        }),
    ];

    const add = (data: Record<string, any>) => {
        $createRequest.mutate({
            slug,
            name: data.name,
            description: data.description,
            price: +data.price,
            type: data.type,
        });
    };
</script>

<Heading title={event?.name + " - Produkte"} />
<Table {rows} {columns} {add} />

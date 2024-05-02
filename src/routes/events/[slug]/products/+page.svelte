<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";
    import Table, {
        TextCell,
        NumberCell,
        columnBuilder,
        type Column,
    } from "$lib/components/table";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
    const productRequest = trpc.events.products.list.query({ slug });
    const createRequest = trpc.events.products.create.mutation({
        onSuccess: () => $productRequest.refetch(),
    });

    let event = $eventRequest.data?.Event;

    // Prob wait for library update to use runes
    $: rows = $productRequest.data ?? [];

    type Row = (typeof rows)[number];

    // let rows: Row[] = $derived([...products]);

    const columns: Column<Row>[] = [
        columnBuilder("name", "Name", {
            component: TextCell,
        }),
        columnBuilder("description", "Beschreibung", {
            component: TextCell,
        }),
        columnBuilder("price", "Preis", {
            component: NumberCell,
        }),
        columnBuilder("type", "Art", {
            component: TextCell,
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

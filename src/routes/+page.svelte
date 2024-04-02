<script lang="ts">
    import { columnBuilder, type Column } from "$lib/components/table";
    import Table from "$lib/components/table/Table.svelte";
    import EditTextCell from "$lib/components/table/cells/text/EditTextCell.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";

    type Row = {
        id: number;
        name: string;
        age: number;
    };

    let rows: Row[] = $state([]);

    const columns: Column<Row>[] = [
        columnBuilder("id", "ID", {
            component: EditTextCell,
            props: (row) => ({
                update: (value: string) => {
                    row.name += value;
                },
            }),
        }),
        columnBuilder("name", "Name", {
            component: EditTextCell,
        }),
        columnBuilder("age", "Age", {
            component: EditTextCell,
        }),
    ];

    $effect(() => {
        const interval = setInterval(() => {
            const r = rows.length + 1;
            rows = [...rows, { id: r, name: "New Row " + r, age: r }];
        }, 100);
        return () => {
            clearInterval(interval);
        };
    });
</script>

<main>
    <h1>FeuerFest</h1>

    <ThemeToggle />

    <Table {rows} {columns} />
</main>

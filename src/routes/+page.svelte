<script lang="ts">
    import MutliDropdown from "$lib/components/MutliDropdown.svelte";
    import { columnBuilder, type Column } from "$lib/components/table";
    import Table, { EditTextCell } from "$lib/components/table";
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

    let options = [
        { value: 1, name: "One" },
        { value: 2, name: "Two" },
        { value: 3, name: "Three" },
    ];

    let selected = $state([]);
</script>

<main>
    <h1>FeuerFest</h1>

    <!-- <ThemeToggle /> -->
    <div class="w-1/2 m-auto">
        <MutliDropdown {options} bind:selected />
    </div>

    <!-- <Table {rows} {columns} /> -->
</main>

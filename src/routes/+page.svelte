<script lang="ts">
    import Table from "$lib/components/table/Table.svelte";

    type Row = {
        id: number;
        name: string;
        age: number;
    };

    let rows: Row[] = $state([]);

    const columns: {key: keyof Row, label: string}[] = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "age", label: "Age" },
    ];

    $effect(() => {
		const interval = setInterval(() => {
            const r = rows.length + 1;
			rows = [...rows, { id: r, name: "New Row " + r, age: r }]
		}, 100);
		return () => {
			clearInterval(interval);
		};
	});

</script>

<main>
    <h1>FeuerFest</h1>

    <Table {rows} {columns} />
</main>

<script lang="ts">
    import Form, {
        NumberInput,
        SubmitButton,
        TextInput,
        EmailInput,
        PasswordInput,
    } from "$lib/components/form";
    import ToggleButton from "$lib/components/form/inputs/ToggleButton.svelte";
    import Heading from "$lib/components/Heading.svelte";
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

    const submit = (e: Event) => {
        console.log(name, age);
    };
    let name = $state("");
    let age = $state<number>();
    let email = $state("");
    let password = $state("");
    let disabled = $state(false);
</script>

<Heading title="FeuerFest" />
<a href="/events">Events</a>

<!-- <button>Logout</button> -->

<!-- <ThemeToggle /> -->
<!-- <div class="w-1/2 m-auto">
    <MutliDropdown {options} bind:selected />
</div> -->

<!-- <Table {rows} {columns} /> -->
<!--
<div class="w-2/3 max-w-screen-sm">
    <Form {submit}>
        <TextInput label="Name" bind:value={name} required />
        <NumberInput label="Age" bind:value={age} />
        <EmailInput label="Email" bind:value={email} />
        <PasswordInput label="Password" bind:value={password} />
        <ToggleButton label="Disabled" bind:checked={disabled} />
        <SubmitButton text="Submit" />
    </Form>
</div> -->

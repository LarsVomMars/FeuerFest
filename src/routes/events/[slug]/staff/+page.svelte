<script lang="ts">
    import { page } from "$app/stores";
    import EditableTextCell from "$lib/components/Table/Cells/Text/EditableTextCell.svelte";
    import TextCell from "$lib/components/Table/Cells/Text/TextCell.svelte";
    import Table from "$lib/components/Table/Table.svelte";
    import { trpc } from "$lib/trpc";
    import { flexRender, type ColumnDef } from "@tanstack/svelte-table";

    const staffRequest = trpc.events.staff.list.query({
        event: $page.params.slug!,
    });

    $: rows = $staffRequest.data ?? [];
    type Staff = (typeof rows)[0];

    const columns: ColumnDef<Staff>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: (ctx) =>
                flexRender(TextCell, {
                    value: ctx.getValue(),
                }),
        },
        {
            id: "role",
            accessorKey: "role",
            header: "Rolle",
            cell: (ctx) =>
                flexRender(EditableTextCell, {
                    value: ctx.getValue(),
                }),
        },
        {
            id: "actions",
            header: "Aktionen",
            cell: () => flexRender(TextCell, { value: "Aktionen" }),
        },
    ];
</script>

<h2 class="font-bold text-2xl">Personal</h2>
<Table {rows} {columns} class="w-1/2">
    <tr class="border-t">
        <td>User select</td>
        <td>Role select</td>
        <td>Submit</td>
    </tr>
</Table>

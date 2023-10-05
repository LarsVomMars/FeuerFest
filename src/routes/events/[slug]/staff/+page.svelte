<script lang="ts">
    import { page } from "$app/stores";
    import EditableSelectCell from "$lib/components/Table/Cells/Select/EditableSelectCell.svelte";
    import EditableTextCell from "$lib/components/Table/Cells/Text/EditableTextCell.svelte";
    import TextCell from "$lib/components/Table/Cells/Text/TextCell.svelte";
    import Table from "$lib/components/Table/Table.svelte";
    import { Role } from "$lib/db/types";
    import { trpc } from "$lib/trpc";
    import { flexRender, type ColumnDef } from "@tanstack/svelte-table";

    const event = $page.params.slug!;

    const staffRequest = trpc.events.staff.list.query({ event });

    const availableStaffRequest = trpc.events.staff.listAvailable.query({
        event,
    });

    $: availableStaff = $availableStaffRequest.data!;

    $: rows = $staffRequest.data ?? [];
    type Staff = (typeof rows)[0];

    const roleOptions = [
        { value: Role.OWNER, label: "Orga", disabled: true },
        { value: Role.ADMIN, label: "Admin", disabled: false },
        { value: Role.USER, label: "Personal", disabled: false },
    ];

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
                flexRender(EditableSelectCell, {
                    value: ctx.getValue(),
                    options: roleOptions,
                }),
        },
        {
            id: "actions",
            header: "Aktionen",
            cell: () => flexRender(TextCell, { value: "Aktionen" }),
        },
    ];

    let role = Role.USER;
</script>

<h2 class="font-bold text-2xl">Personal</h2>
<Table {rows} {columns} class="w-1/2">
    <tr class="border-t">
        <td>
            <div class="w-full">
                <select bind:value={role} class="bg-transparent w-full">
                    {#if $availableStaffRequest.isSuccess && availableStaff}
                        {#each availableStaff as option}
                            <option value={option.id}>{option.name}</option>
                        {/each}
                    {/if}
                </select>
            </div>
        </td>
        <td>
            <div class="w-full">
                <select bind:value={role} class="bg-transparent w-full">
                    {#each roleOptions as option}
                        {#if !option.disabled}
                            <option value={option.value}>
                                {option.label}
                            </option>
                        {/if}
                    {/each}
                </select>
            </div>
        </td>
        <td>Submit</td>
    </tr>
</Table>

<script lang="ts">
    import { page } from "$app/stores";
    import DeleteAction from "$lib/components/Table/Cells/Action/DeleteAction.svelte";
    import EditableSelectCell from "$lib/components/Table/Cells/Select/EditableSelectCell.svelte";
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

    const addRequest = trpc.events.staff.add.mutation({
        onSuccess: () => {
            $staffRequest.refetch();
            $availableStaffRequest.refetch();
            userId = -1;
            role = Role.USER;
        },
        onError: (err) => console.error(err.message),
    });

    const updateRequest = trpc.events.staff.update.mutation({
        onSuccess: () => {
            $staffRequest.refetch();
        },
        onError: (err) => console.error(err.message),
    });

    const removeRequest = trpc.events.staff.remove.mutation({
        onSuccess: () => {
            $staffRequest.refetch();
            $availableStaffRequest.refetch();
        },
        onError: (err) => console.error(err.message),
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
                    onChange: makeOnChange(ctx.row.original),
                }),
        },
        {
            id: "actions",
            header: "Aktionen",
            cell: (ctx) =>
                flexRender(DeleteAction, {
                    action: makeRemoveAction(ctx.row.original),
                    disabled: ctx.row.original.role === Role.OWNER,
                }),
        },
    ];

    let userId: number = -1;
    let role = Role.USER;

    const addUser = () => {
        if (submitDisabled) return;
        $addRequest.mutate({ slug: event, userId, role });
    };

    const makeOnChange = (row: Staff) => (value: string) => {
        $updateRequest.mutate({
            slug: event,
            userId: row.userId,
            role: value as Role,
        });
    };

    const makeRemoveAction = (row: Staff) => () => {
        $removeRequest.mutate({ slug: event, userId: row.userId });
    };

    $: disabled = availableStaff?.length === 0;
    $: submitDisabled = userId === -1 || disabled;
</script>

<h2 class="font-bold text-2xl">Personal</h2>
<Table {rows} {columns} class="w-1/2">
    <tr class="border-t {disabled ? 'opacity-50' : ''}">
        <td>
            <div class="w-full">
                <select
                    bind:value={userId}
                    class="bg-transparent w-full"
                    {disabled}
                >
                    {#if $availableStaffRequest.isSuccess && availableStaff}
                        <option value={-1}></option>
                        {#each availableStaff as option}
                            <option value={option.id}>{option.name}</option>
                        {/each}
                    {/if}
                </select>
            </div>
        </td>
        <td>
            <div class="w-full">
                <select
                    bind:value={role}
                    class="bg-transparent w-full"
                    {disabled}
                >
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
        <td>
            <button on:click={addUser} disabled={submitDisabled} class="w-full">
                Hinzufügen
            </button>
        </td>
    </tr>
</Table>

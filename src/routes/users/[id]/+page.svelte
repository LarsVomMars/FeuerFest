<script lang="ts">
    import { page } from "$app/stores";
    import { Role, Status } from "$lib/db/types";
    import { trpc } from "$lib/trpc";
    import type { PageData } from "./$types";

    let data: PageData;

    const userRequest = trpc.users.get.query({ id: Number($page.params.id) });
    const undummifyRequest = trpc.users.undummify.mutation({
        onSuccess: () => $userRequest.refetch(),
    });
    const activateRequest = trpc.users.activate.mutation({
        onSuccess: () => $userRequest.refetch(),
    });
    const deactivateRequest = trpc.users.deactivate.mutation({
        onSuccess: () => $userRequest.refetch(),
    });

    $: user = $userRequest.data!;

    const undummify = () => $undummifyRequest.mutate({ id: user.id });
    const activate = () => $activateRequest.mutate({ id: user.id });
    const deactivate = () => $deactivateRequest.mutate({ id: user.id });
</script>

{#if $userRequest.isSuccess && user}
    <h1 class="text-4xl font-bold">{user.name}</h1>
    <p>{user.username}</p>
    <p>{user.email}</p>
    <p>{Boolean(user.dummy)}</p>
    <p>{user.status}</p>
    <p>{user.role}</p>

    <div class="flex flex-col gap-4 mt-4 w-1/6">
        {#if user.dummy}
            <button
                class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed"
                on:click={undummify}
            >
                Undummify
            </button>
        {/if}

        {#if !user.dummy && user.status !== Status.ACTIVE}
            <button
                class="w-full rounded-lg bg-ffgreen p-2 hover:bg-ffgreen-dimmed"
                on:click={activate}
            >
                Aktivieren
            </button>
        {/if}

        {#if user.status === Status.ACTIVE && user.role !== Role.OWNER}
            <button
                class="w-full rounded-lg bg-ffred p-2 hover:bg-ffred-dimmed"
                on:click={deactivate}
            >
                Deaktivieren
            </button>
        {/if}
    </div>
{/if}

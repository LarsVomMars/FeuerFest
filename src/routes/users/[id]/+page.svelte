<script lang="ts">
    import { page } from "$app/stores";
    import { Status } from "$lib/db/types";
    import { trpc } from "$lib/trpc";

    const userRequest = trpc.users.get.query({ id: Number($page.params.id) });
    const undummifyRequest = trpc.users.undummify.mutation({
        onSuccess: () => $userRequest.refetch(),
    });

    $: user = $userRequest.data!;

    const undummify = () => {
        $undummifyRequest.mutate({ id: user.id });
    };

    const activate = () => {
        console.log("activate");
        // $activateRequest.mutate({ id: user.id });
    };

    const deactivate = () => {
        console.log("deactivate");
        // $deactivateRequest.mutate({ id: user.id });
    };

    const reactivate = () => {
        console.log("reactivate");
        // $reactivateRequest.mutate({ id: user.id });
    };

    // TODO: Check against session
</script>

{#if $userRequest.isSuccess}
    <h1 class="text-4xl font-bold">{user.name}</h1>
    <p>{user.username}</p>
    <p>{user.email}</p>
    <p>{user.dummy}</p>

    {#if user.dummy}
        <button on:click={undummify}>Undummify</button>
    {/if}

    {#if !user.dummy && user.status === Status.PENDING}
        <button on:click={activate}>Aktivieren</button>
    {/if}

    {#if user.status === Status.ACTIVE}
        <button on:click={deactivate}>Deaktivieren</button>
    {/if}

    {#if user.status === Status.INACTIVE}
        <button on:click={reactivate}>Reaktivieren</button>
    {/if}
{/if}

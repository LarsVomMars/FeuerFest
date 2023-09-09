<script lang="ts">
    import { trpc } from "$lib/trpc";

    const listRequest = trpc.users.list.query();
    $: users = $listRequest.data!;
</script>

<h1 class="text-4xl font-bold">Benutzer</h1>

{#if $listRequest.isSuccess}
    <div class="flex flex-col gap-4 my-4 justify-center items-center">
        {#each users as user}
            <a href="/users/{user.id}">
                {user.name}
            </a>
        {/each}
    </div>
{/if}

<a
    href="/users/new"
    class="w-1/5 rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark text-center"
>
    Neuen Benutzer anlegen
</a>

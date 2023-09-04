<script lang="ts">
    import { trpc } from "$lib/trpc";

    const activeRequest = trpc.events.listActive.query();
    const upcomingRequest = trpc.events.listUpcoming.query();
    const pastRequest = trpc.events.listPast.query();
</script>

<h1 class="text-4xl font-black">Veranstaltungen</h1>

{#if $activeRequest.isSuccess && $activeRequest.data.length > 0}
    <h1>Aktiv</h1>
    <ul>
        {#each $activeRequest.data as event}
            <li>
                <a href="/events/{event.id}">{event.name}</a>
            </li>
        {/each}
    </ul>
{/if}

{#if $upcomingRequest.isSuccess && $upcomingRequest.data.length > 0}
    <h1>Anstehend</h1>
    <ul>
        {#each $upcomingRequest.data as event}
            <li>
                <a href="/events/{event.id}">{event.name}</a>
            </li>
        {/each}
    </ul>
{/if}

{#if $pastRequest.isSuccess && $pastRequest.data.length > 0}
    <h1>Vergangen</h1>
    <ul>
        {#each $pastRequest.data as event}
            <li>
                <a href="/events/{event.id}">{event.name}</a>
            </li>
        {/each}
    </ul>
{/if}

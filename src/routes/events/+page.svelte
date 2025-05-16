<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";
    import type { PageData } from "./$types";

    const activeEvents = trpc.events.listActive.query();
    const pastEvents = trpc.events.listPast.query();
    const upcomingEvents = trpc.events.listUpcoming.query();

    export let data: PageData;
</script>

<Heading title="Events" />

<h2>Aktuelle Events</h2>
{#if $activeEvents.isSuccess}
    {#each $activeEvents.data as row (row.Event.slug)}
        {@const event = row.Event}
        <a href="/events/{event.slug}">{event.name}</a>
    {/each}
{/if}

<h2>Kommende Events</h2>
{#if $upcomingEvents.isSuccess}
    {#each $upcomingEvents.data as row (row.Event.slug)}
        {@const event = row.Event}
        <a href="/events/{event.slug}">{event.name}</a>
    {/each}
{/if}

<h2>Vergangene Events</h2>
{#if $pastEvents.isSuccess}
    {#each $pastEvents.data as row (row.Event.slug)}
        {@const event = row.Event}
        <a href="/events/{event.slug}">{event.name}</a>
    {/each}
{/if}

{#if data.role !== "USER"}
    <a href="/events/new">Neu</a>
{/if}

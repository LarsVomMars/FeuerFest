<script lang="ts">
    import { page } from "$app/stores";
    import { trpc } from "$lib/trpc";

    const slug = $page.params.slug!;
    const eventRequest = trpc.events.getBySlug.query({ slug });
    $: event = $eventRequest.data;
</script>

{#if $eventRequest.isSuccess && event}
    <h1 class="text-4xl font-bold">{event.name}</h1>
    <div class="text-center">
        <p class="text-xl">{event.description}</p>
        <p class="text-xl">{event.location}</p>
        <p class="text-xl">{event.start.toLocaleString()}</p>
        <p class="text-xl">{event.end.toLocaleString()}</p>
    </div>
{/if}

<a href="/events/{slug}/staff">Personal</a>

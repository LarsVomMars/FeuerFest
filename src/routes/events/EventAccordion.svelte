<script lang="ts">
    import Accordion from "$lib/components/Accordion.svelte";

    type T = {
        name: string;
        description: string;
        location: string;
        start: Date;
        end: Date;
        slug: string;
    };

    export let title: string;
    export let open = false;
    export let data: T[] | undefined;
</script>

<Accordion {title} {open}>
    <ul>
        {#if data}
            {#each data as event}
                <li>
                    <a
                        href="/events/{event.slug}"
                        class="flex flex-row justify-between"
                    >
                        <span>{event.name}: {event.description}</span>
                        <span>{event.location}</span>
                    </a>
                </li>
            {/each}
        {/if}
    </ul>
</Accordion>

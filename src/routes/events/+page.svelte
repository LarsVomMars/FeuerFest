<script lang="ts">
    import Accordion from "$lib/components/Accordion.svelte";
    import { RoleValue } from "$lib/db/types";
    import { trpc } from "$lib/trpc";
    import type { PageData } from "./$types";
    import EventAccordion from "./EventAccordion.svelte";

    export let data: PageData;

    const activeRequest = trpc.events.listActive.query();
    const upcomingRequest = trpc.events.listUpcoming.query();
    const pastRequest = trpc.events.listPast.query();
</script>

<h1 class="text-4xl font-bold">Veranstaltungen</h1>

<div
    class="mt-4 flex flex-col justify-center items-center w-5/6 md:w-1/2 gap-4"
>
    <EventAccordion
        title="Aktiv"
        data={$activeRequest.data}
        open={Boolean($activeRequest.data?.length)}
    />
    <EventAccordion title="Anstehend" data={$upcomingRequest.data} />
    <EventAccordion title="Vergangen" data={$pastRequest.data} />

    {#if RoleValue[data.user.role] >= RoleValue.ADMIN}
        <a
            href="/events/new"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark text-center"
        >
            Neu
        </a>
    {/if}
</div>

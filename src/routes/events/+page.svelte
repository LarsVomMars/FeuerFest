<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<Heading title="Events" />
{#if data.role !== "USER"}
    <a href="/events/new">Neu</a>
{/if}

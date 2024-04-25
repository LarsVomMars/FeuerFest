<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";


    const eventRequest = trpc.events.get.query({ slug: $page.params.slug! });

</script>

<Heading title={$eventRequest.data?.Event.name ?? ""} />
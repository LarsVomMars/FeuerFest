<script lang="ts">
    import { page } from "$app/stores";
    import Heading from "$lib/components/Heading.svelte";
    import { trpc } from "$lib/trpc";

    let slug = $page.params.slug!;
    const eventRequest = trpc.events.get.query({ slug });
</script>

<Heading title={$eventRequest.data?.Event.name ?? ""} />
<a href={`/events/${slug}/products`}>Produkte</a>

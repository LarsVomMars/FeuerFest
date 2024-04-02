<script lang="ts">
    import "../app.css";
    import { QueryClientProvider } from "@tanstack/svelte-query";
    import type { LayoutServerData } from "./$types";
    import { trpc } from "$lib/trpc";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";

    export let data: LayoutServerData;

    const queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
    <slot />
</QueryClientProvider>

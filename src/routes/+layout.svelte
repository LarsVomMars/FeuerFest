<script lang="ts">
    import "../app.css";
    import { QueryClientProvider } from "@tanstack/svelte-query";
    import type { LayoutData } from "./$types";
    import { trpc } from "$lib/trpc";
    import Header from "$lib/components/Header.svelte";

    export let data: LayoutData;

    const queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<svelte:head>
    <title>FeuerFest</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
    <Header />
    <main
        class="w-full h-[100vh] bg-ffdark text-white flex flex-col justify-center items-center gap-y-4"
    >
        <slot />
    </main>
</QueryClientProvider>

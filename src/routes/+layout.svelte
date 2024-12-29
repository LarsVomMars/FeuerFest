<script lang="ts">
    import "../app.css";
    import { QueryClientProvider } from "@tanstack/svelte-query";
    import type { LayoutServerData } from "./$types";
    import { trpc } from "$lib/trpc";
    import Header from "$lib/components/Header.svelte";

    export let data: LayoutServerData;

    const queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
    <Header />
    <main
        class="w-full h-[100vh] bg-white text-dark dark:bg-dark dark:text-white flex flex-col justify-center items-center gap-y-4"
    >
        <slot />
    </main>
</QueryClientProvider>

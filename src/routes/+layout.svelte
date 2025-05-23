<script lang="ts">
    import "../app.css";
    import { trpc } from "$lib/trpc";
    import Header from "$lib/components/Header.svelte";

    const { data, children } = $props();
    trpc.hydrateFromServer(() => data.trpc);
</script>

<!-- <Header /> -->
<main
    class="text-dark dark:bg-dark flex h-[100vh] w-full flex-col items-center justify-center gap-y-4 bg-white dark:text-white"
>
    {@render children?.()}
</main>

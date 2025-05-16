<script lang="ts">
    import "../app.css";
    import { trpc } from "$lib/trpc";
    import Header from "$lib/components/Header.svelte";

    const { data, children } = $props();
    trpc.hydrateFromServer(() => data.trpc);
</script>


<Header />
<main
    class="w-full h-[100vh] bg-white text-dark dark:bg-dark dark:text-white flex flex-col justify-center items-center gap-y-4"
>
    {@render children?.()}
</main>

<script lang="ts">
    import "../app.css";
    import {QueryClientProvider} from "@tanstack/svelte-query";
    import type {LayoutData} from "./$types";
    import {trpc} from "$lib/trpc";
    import Header from "$lib/components/Header.svelte";
    import {browser} from "$app/environment";

    export let data: LayoutData;

    const queryClient = trpc.hydrateFromServer(data.trpc);
    //load preferred theme
    if (browser) {
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
</script>

<svelte:head>
    <title>FeuerFest</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
    <Header/>
    <main
        class="w-full h-[100vh] bg-fflight text-black dark:bg-ffdark  dark:text-white flex flex-col justify-center items-center gap-y-4"
    >
        <slot/>
    </main>
</QueryClientProvider>


<style>
    :global(body) {
        transition: background-color 0.3s
    }

</style>

<script lang="ts">
    import { trpc } from "$lib/trpc";
    import Heading from "./Heading.svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import ThemeToggle from "./ThemeToggle.svelte";

    const logoutRequest = trpc.auth.logout.mutation();

    const logout = () => {
        $logoutRequest.mutate();
        goto("/");
    };
</script>

<header
    class="bg-primary text-white p-2 fixed flex justify-between w-full items-center"
>
    <Heading title="FeuerFest" />
    <div class="flex w-1/6 justify-end space-x-4">
        <ThemeToggle />
        {#if page.url.pathname !== "/auth/login"}
            <button onclick={logout}>Logout</button>
        {/if}
    </div>
</header>

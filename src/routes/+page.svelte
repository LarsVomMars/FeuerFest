<script lang="ts">
    import { Role } from "$lib/db/types";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1 class="text-4xl font-bold">Hallo {data.user?.name}</h1>

<div class="flex flex-col text-center mt-16 gap-y-4">
    {#if data.user.role === Role.OWNER}
        <a class="hover:opacity-80" href="/users">Benutzer</a>
    {/if}
    <a class="hover:opacity-80" href="/events">Veranstaltungen</a>
</div>

<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1 class="text-4xl font-bold">Hallo {data.user?.name}</h1>


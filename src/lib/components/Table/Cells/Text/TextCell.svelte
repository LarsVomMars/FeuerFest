<script lang="ts">
    export let value: string;
</script>

<div class="w-full h-full">
    {#if !value}
        &nbsp;
    {:else}
        {value}
    {/if}
</div>

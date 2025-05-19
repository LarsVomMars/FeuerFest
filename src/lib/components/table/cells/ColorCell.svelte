<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    let {
        value = $bindable(),
        required = false,
        disabled = false,
    }: HTMLInputAttributes = $props();
</script>

<input
    type="color"
    class="border-primary h-10 w-full rounded-lg border-2 bg-transparent p-2 focus:outline-none"
    bind:value
    {disabled}
    {required}
/>

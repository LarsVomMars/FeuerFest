<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    let {
        value = $bindable(),
        required = false,
        disabled = false,
        ...props
    }: HTMLInputAttributes = $props();
</script>

<input
    type="text"
    class="border-primary h-10 w-full rounded-lg border-2 bg-transparent p-2 focus:outline-none"
    bind:value
    {disabled}
    {required}
    {...props}
/>

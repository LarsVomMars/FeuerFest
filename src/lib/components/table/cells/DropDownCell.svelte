<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    let {
        value = $bindable(),
        options,
        required = false,
        disabled = false,
    }: HTMLInputAttributes & {
        options: { label: string; value: string }[];
    } = $props();
</script>

<select
    class="border-primary dark:bg-dark h-10 w-full rounded-lg border-2 bg-white p-2 focus:outline-none"
    bind:value
    {disabled}
    {required}
>
    {#each options as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>

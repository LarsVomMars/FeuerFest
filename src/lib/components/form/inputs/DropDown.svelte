<script module>
    type Props = DefaultProps & {
        options: { label: string; value: string }[];
    };
</script>

<script lang="ts">
    import type { DefaultProps } from ".";

    let {
        value = $bindable(),
        label,
        options,
        required = false,
        disabled = false,
    }: Props = $props();

    let id = label.replace(/\s/g, "_").toLowerCase();
</script>

<div class="w-full">
    <label
        for={id}
        class="dark:bg-dark absolute translate-x-5 -translate-y-4 bg-white px-1 select-none dark:text-white"
    >
        {label}
        {#if required}
            <span class="text-primary-200">*</span>
        {/if}
    </label>
    <select
        {id}
        class="border-primary w-full rounded-lg border-2 bg-white dark:bg-dark p-2 focus:outline-none h-10"
        bind:value
        {disabled}
        {required}
    >
        {#each options as option}
            <option value={option.value} >{option.label}</option>
        {/each}
    </select>
</div>

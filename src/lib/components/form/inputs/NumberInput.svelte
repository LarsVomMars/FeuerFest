<script lang="ts">
    import type { DefaultProps } from ".";

    let {
        value,
        label,
        required = false,
        disabled = false,
    }: DefaultProps<number> = $props();

    let id = label.replace(/\s/g, "_").toLowerCase();
</script>

<div class="w-full">
    <label
        for={id}
        class="absolute -translate-y-4 translate-x-5 select-none px-1 bg-white dark:bg-dark dark:text-white"
    >
        {label}
        {#if required}
            <span class="text-primary-200">*</span>
        {/if}
    </label>
    <input
        type="number"
        {id}
        class="w-full rounded-lg border-2 border-primary bg-transparent p-2 focus:outline-none"
        bind:value
        {disabled}
        {required}
    />
</div>

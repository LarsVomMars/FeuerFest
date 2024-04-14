<script lang="ts">
    import type { DefaultProps } from ".";

    let {
        value,
        label,
        required = false,
        disabled = false,
    }: DefaultProps = $props();

    let id = label.replace(/\s/g, "_").toLowerCase();
</script>

<div class="w-full">
    <label
        for={id}
        class="absolute -translate-y-4 translate-x-5 select-none px-1 bg-white"
    >
        {label}
        {#if required}
            <span class="text-red">*</span>
        {/if}
    </label>
    <input
        type="email"
        {id}
        class="w-full rounded-lg border-2 border-black bg-transparent p-2 focus:outline-none"
        bind:value
        {disabled}
        {required}
    />
</div>

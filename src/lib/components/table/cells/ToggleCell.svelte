<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type Props = {
        checked: boolean;
        disabled?: boolean;
    };

    let {
        checked = $bindable(),
        disabled = false,
        ...props
    }: HTMLInputAttributes = $props();
</script>

<input
    type="checkbox"
    {disabled}
    bind:checked
    {...props}
    class="bg-primary dark:before:bg-dark checked:bg-secondary relative h-[1.6em] w-[3em] cursor-pointer appearance-none rounded-[0.2em] duration-300 ease-in-out select-none before:absolute before:top-[0.2em] before:left-[0.2em] before:block before:h-[1.2em] before:w-[1.2em] before:rounded-[0.2em] before:bg-white before:transition-all before:content-[''] checked:before:left-[1.6em]"
/>

<script lang="ts">
    import type { Option } from ".";
    import SelectCell from "./SelectCell.svelte";

    type Props = {
        value: string;
        options: Option[];
        edit?: boolean;
        update?: (value: string) => void;
    };

    let { value, options, update, edit = false }: Props = $props();

    function toggleEditing() {
        if (edit) isEditing = !isEditing;
        if ((!isEditing || edit) && update) {
            update(value);
        }
    }

    let isEditing = $state(edit);
</script>

{#if isEditing}
    <select
        class="border-primary-200 w-full border-2 bg-transparent outline-none"
        bind:value
        onblur={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
    >
        {#each options as { label, value } (value)}
            <option {value}>{label}</option>
        {/each}
    </select>
{:else}
    <SelectCell
        value={options.find((o) => o.value === value)?.label || ""}
        onclick={toggleEditing}
    />
{/if}

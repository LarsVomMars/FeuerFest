<script lang="ts">
    import NumberCell from "./NumberCell.svelte";

    type Props = {
        value: number;
        edit?: boolean;
        update?: (value: number) => void;
    };

    let { value, update, edit = false }: Props = $props();

    function toggleEditing() {
        if (edit) return;
        isEditing = !isEditing;
        if (!isEditing && update) {
            update(value);
        }
    }

    let isEditing = $state(edit);
</script>

{#if isEditing}
    <input
        type="number"
        class="bg-transparent border-2 border-primary-200 outline-none w-full"
        bind:value
        onblur={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
    />
{:else}
    <NumberCell {value} onclick={toggleEditing} />
{/if}

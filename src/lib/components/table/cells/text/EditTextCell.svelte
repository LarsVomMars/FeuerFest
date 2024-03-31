<script lang="ts">
    import TextCell from "./TextCell.svelte";

    let isEditing = $state(false);

    type Props = {
        value: string;
        update?: (value: string) => void;
    };

    let { value, update }: Props = $props();

    function toggleEditing() {
        isEditing = !isEditing;
        if (!isEditing && update) {
            update(value);
        }
    }
</script>

{#if isEditing}
    <input
        type="text"
        bind:value
        onblur={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
    />
{:else}
    <TextCell {value} onclick={toggleEditing} />
{/if}

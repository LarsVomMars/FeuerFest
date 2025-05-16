<script lang="ts">
    import TextCell from "./TextCell.svelte";

    type Props = {
        value: string;
        edit?: boolean;
        update?: (value: string) => void;
    };

    let { value, update, edit = false }: Props = $props();

    function toggleEditing() {
        if (!edit) isEditing = !isEditing;
        if ((!isEditing && update) || (edit && update)) {
            update(value);
        } else if (isEditing) {
            setTimeout(() => input?.focus(), 0);
        }
    }

    let input = $state<HTMLInputElement>();
    let isEditing = $state(edit);
</script>

{#if isEditing}
    <input
        type="text"
        class="border-primary-200 w-full border-2 bg-transparent outline-none"
        bind:value
        onblur={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
        bind:this={input}
    />
{:else}
    <TextCell {value} onclick={toggleEditing} />
{/if}

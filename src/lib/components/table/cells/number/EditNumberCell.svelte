<script lang="ts">
    import NumberCell from "./NumberCell.svelte";

    type Props = {
        value: number;
        edit?: boolean;
        update?: (value: number) => void;
        adornment?: string;
    };

    let { value, update, adornment, edit = false }: Props = $props();

    function toggleEditing() {
        if (edit) isEditing = !isEditing;
        if ((!isEditing || edit) && update) {
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
        type="number"
        class="bg-transparent border-2 border-primary-200 outline-none w-full"
        bind:value
        onblur={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
        bind:this={input}
    />
{:else}
    <NumberCell {value} {adornment} onclick={toggleEditing} />
{/if}

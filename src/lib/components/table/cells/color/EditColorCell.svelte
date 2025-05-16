<script lang="ts">
    import ColorCell from "./ColorCell.svelte";

    type Props = {
        value: string;
        defaultColor?: string;
        edit?: boolean;
        update?: (value: string) => void;
    };

    let { value, update, defaultColor, edit = false }: Props = $props();

    $effect(() => {
        if (!value && defaultColor) value = defaultColor;
    });

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
        type="color"
        class="border-primary-200 w-full border-2 bg-transparent outline-none"
        bind:value
        onchange={toggleEditing}
        onkeydown={(event) => event.key === "Enter" && toggleEditing()}
        bind:this={input}
    />
{:else}
    <ColorCell {value} onclick={toggleEditing} />
{/if}

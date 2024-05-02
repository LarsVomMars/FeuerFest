<script lang="ts">
    type Props = {
        ondelete?: () => void;
    };

    let { ondelete }: Props = $props();
</script>

<button
    class="text-red-500 hover:text-red-700"
    onclick={ondelete}
    onkeypress={(e) => e.key === "Enter" && ondelete?.()}
>
    <img src="/icons/trash.svg" alt="Delete" />
</button>

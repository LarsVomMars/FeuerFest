<script lang="ts">
    export let action: () => void;
    export let disabled = false;

    const actionWrapper = () => {
        if (disabled) return;
        action();
    };
</script>

<button
    class="w-full flex flex-col items-center"
    on:click={actionWrapper}
    {disabled}
>
    <img
        src="/icons/trash.svg"
        alt="Delete"
        class="w-4 h-4 {disabled ? 'opacity-50' : 'cursor-pointer'}"
    />
</button>

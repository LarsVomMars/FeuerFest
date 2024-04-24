<script lang="ts">
    type Props = {
        text: string;
    };
    let { text }: Props = $props();
</script>

<button
    type="submit"
    class="w-full rounded-lg bg-secondary p-2 hover:bg-secondary-200 disabled:bg-secondary-300 text-white"
>
    {text}
</button>

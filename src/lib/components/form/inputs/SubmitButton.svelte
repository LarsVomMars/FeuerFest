<script lang="ts">
    type Props = {
        text: string;
    };
    let { text }: Props = $props();
</script>

<button
    type="submit"
    class="bg-secondary hover:bg-secondary-200 disabled:bg-secondary-300 w-full cursor-pointer rounded-lg p-2 text-white"
>
    {text}
</button>

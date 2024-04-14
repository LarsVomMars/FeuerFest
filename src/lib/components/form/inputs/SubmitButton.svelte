<script lang="ts">
    type Props = {
        text: string;
    };
    let { text }: Props = $props();
</script>

<button type="submit">
    {text}
</button>
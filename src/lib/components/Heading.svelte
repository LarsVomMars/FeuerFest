<script lang="ts">
    type Props = {
        title: string;
    };

    let { title }: Props = $props();
</script>

<h1 class="text-4xl font-bold">
    {title}
</h1>

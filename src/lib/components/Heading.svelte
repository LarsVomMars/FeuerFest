<script lang="ts">
    type Props = {
        title: string;
    };

    let { title }: Props = $props();
</script>

<h1 class="decoration-primary text-4xl font-bold underline select-none">
    {title}
</h1>

<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        submit: (e: Event) => void;
        children?: Snippet;
    };

    let { submit, children }: Props = $props();

    const onsubmit = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        submit(e);
    };
</script>

<form
    {onsubmit}
    class="flex flex-1 flex-col w-full items-center justify-center space-y-8 p-4"
>
    {@render children?.()}
</form>

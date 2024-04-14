<script lang="ts">
    type Props = {
        submit: (e: Event) => void;
    };

    let { submit }: Props = $props();

    const onsubmit = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        submit(e);
    };
</script>

<form {onsubmit} class="flex flex-1 flex-col w-full items-center justify-center m-4 gap-4 space-y-8 p-4">
    <slot />
</form>

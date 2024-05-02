<script lang="ts">
    type Props = {
        value: string;
        onclick?: () => void;
    };
    let { value, onclick }: Props = $props();

    let cursor = onclick ? "cursor-pointer" : "cursor-default";
    let span = $state<HTMLSpanElement>();

    $effect(() => {
        span && (span.style.backgroundColor = value);
    });
</script>

<span
    class="w-full h-[1rem] block {cursor}"
    {onclick}
    role="button"
    tabindex="0"
    onkeypress={(e) => e.key === "Enter" && onclick?.()}
    bind:this={span}
/>

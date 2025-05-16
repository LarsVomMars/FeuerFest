<script lang="ts">
    type Props = {
        value: string;
        onclick?: () => void;
    };
    let { value, onclick }: Props = $props();

    let cursor = onclick ? "cursor-pointer" : "cursor-default";
    let span = $state<HTMLSpanElement>();

    $effect(() => {
        if (span) span.style.backgroundColor = value;
    });
</script>

<span
    class="block h-[1rem] w-full {cursor} border-dark border dark:border-white"
    {onclick}
    role="button"
    tabindex="0"
    onkeypress={(e) => e.key === "Enter" && onclick?.()}
    bind:this={span}
></span>

<script lang="ts">
    type Props = {
        value: number;
        onclick?: () => void;
    };
    let { value, onclick }: Props = $props();

    let cursor = onclick ? "cursor-pointer" : "cursor-default";
</script>

<span
    class="w-full {cursor}"
    {onclick}
    role="button"
    tabindex="0"
    onkeypress={(e) => e.key === "Enter" && onclick?.()}
>
    {value}
</span>

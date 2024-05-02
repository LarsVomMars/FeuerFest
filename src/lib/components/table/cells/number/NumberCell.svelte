<script lang="ts">
    type Props = {
        value: number;
        onclick?: () => void;
        adornment?: string;
    };
    let { value, onclick, adornment }: Props = $props();

    let cursor = onclick ? "cursor-pointer" : "cursor-default";
</script>

<span
    class="w-full {cursor} block text-right"
    {onclick}
    role="button"
    tabindex="0"
    onkeypress={(e) => e.key === "Enter" && onclick?.()}
>
    {value}
    {adornment}
</span>

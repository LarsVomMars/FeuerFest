<script lang="ts">
    type Props = {
        value: string;
        onclick: () => void;
    };
    let { value, onclick }: Props = $props();
</script>

<span
    {onclick}
    role="button"
    tabindex="0"
    on:keypress={(e) => e.key === "Enter" && onclick()}>{value}</span
>

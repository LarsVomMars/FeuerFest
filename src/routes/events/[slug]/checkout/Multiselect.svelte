<script lang="ts">
    type Option = {
        value: string;
        label: string;
    };

    export let options: Option[];
    export let value: string[];

    const toggle = (option: Option) => () => {
        if (value.includes(option.value)) {
            value = value.filter((v) => v !== option.value);
        } else {
            value = [...value, option.value];
        }
    };
</script>

<div class="flex flex-col">
    {#each options as option}
        <button
            class={value.includes(option.value)
                ? "bg-ffgreen-dark"
                : "bg-ffred-dimmed"}
            on:click={toggle(option)}
        >
            {option.label}
        </button>
    {/each}
</div>

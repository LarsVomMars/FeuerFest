<script lang="ts">
    import TextCell from "../Text/TextCell.svelte";

    type Option = {
        value: string;
        label: string | undefined;
        disabled: boolean | undefined;
    };

    export let value: string;
    export let options: Option[];
    export let onChange: (value: string) => void;

    let edit = false;

    let prevValue = value;

    const click = () => {
        if (edit) return;
        if (options.some((o) => o.disabled)) return;
        edit = true;
    };

    const blur = () => {
        edit = false;
        if (prevValue !== value) {
            onChange(value);
        }
    };

    const keypress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            if (edit) blur();
            else click();
        }
    };
</script>

<div
    class="w-full h-full"
    on:click={click}
    on:keypress={keypress}
    role="textbox"
    tabindex="0"
>
    {#if edit}
        <div class="w-full">
            <select on:blur={blur} bind:value class="bg-transparent w-full">
                {#each options as option}
                    <option value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>
                {/each}
            </select>
        </div>
    {:else}
        <TextCell value={options.find((v) => v.value === value)?.label || ""} />
    {/if}
</div>

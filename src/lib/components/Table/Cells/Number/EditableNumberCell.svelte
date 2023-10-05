<script lang="ts">
    import NumberCell from "./NumberCell.svelte";

    export let value: string;
    export let onChange: (value: string) => void;
    export let adornment = "";

    let edit = false;
    let input: HTMLInputElement;

    let prevValue = value;

    const click = () => {
        if (edit) return;
        edit = true;
        setTimeout(() => input.focus(), 0);
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
        <div class="w-full h-full relative">
            <input
                bind:value
                bind:this={input}
                type="number"
                class="w-full bg-transparent"
                min={0}
                step={0.01}
                on:blur={blur}
            />
            {#if adornment}
                <div
                    class="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center text-blue-gray-500"
                >
                    {adornment}
                </div>
            {/if}
        </div>
    {:else}
        <NumberCell {value} {adornment} />
    {/if}
</div>

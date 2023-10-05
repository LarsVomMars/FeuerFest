<script lang="ts">
    import TextCell from "./TextCell.svelte";

    export let value: string;
    export let onChange: (value: string) => void;

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
        <div class="w-full h-full">
            <input
                bind:value
                bind:this={input}
                class="w-full bg-transparent"
                on:blur={blur}
            />
        </div>
    {:else}
        <TextCell {value} />
    {/if}
</div>

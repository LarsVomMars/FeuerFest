<script lang="ts" module>
    export type Option<T = string> = {
        value: T;
        name: string;
    };
</script>

<script lang="ts" generics="T = string">
    type Props<T> = {
        options: Option<T>[];
        selected: Option<T>[];
        start?: Option<T>[];
    };

    let { options, selected = $bindable(), start }: Props<T> = $props();

    let open = $state(false);
    // TODO: Debug, this doesnt work when bound
    // let availableOptions = $derived(
    //     options.filter((o) => !selected.includes(o)),
    // );
    let availableOptions = $state(
        options.filter((o) => !(start ?? []).includes(o)),
    );
    selected = start ?? [];

    const selectOption = (option: Option<T>) => {
        selected = [...selected, option];
        availableOptions = availableOptions.filter((o) => o !== option);
    };

    const removeOption = (option: Option<T>) => {
        selected = selected.filter((s) => s !== option);
        availableOptions = [...availableOptions, option];
    };

    let div: HTMLDivElement;

    const handleClick = (event: MouseEvent | TouchEvent) => {
        if (div && !div.contains(event.target as Node)) {
            open = false;
        }
    };
</script>

<svelte:window onclick={handleClick} ontouchstart={handleClick} />

<div
    class="w-full relative items-center flex cursor-text box-border border-2 border-primary rounded-md"
    bind:this={div}
>
    <ul class="flex flex-row rounded-md p-0 m-0">
        {#each selected as option}
            <li
                role="option"
                aria-selected="true"
                class="items-center rounded-md flex m-1 leading-normal whitespace-nowrap p-1 cursor-pointer"
                onclick={() => removeOption(option)}
                onkeypress={(e) => {
                    if (e.key === "Enter") {
                        removeOption(option);
                    }
                }}
            >
                {option.name}
            </li>
        {/each}
        <input
            type="text"
            onfocus={() => (open = !!availableOptions.length)}
            class="border-none outline-none bg-transparent flex-1 rounded-none w-fit"
        />
    </ul>
    {#if open}
        <ul
            class="top-[100%] left-0 w-full absolute overflow-auto box-border p-2 my-1 bg-white dark:bg-dark rounded-md shadow-lg border-2 border-primary"
        >
            {#each availableOptions as option}
                <li
                    onclick={() => selectOption(option)}
                    class="p-2 cursor-pointer"
                    role="option"
                    aria-selected="false"
                    onkeypress={(e) => {
                        if (e.key === "Enter") {
                            selectOption(option);
                        }
                    }}
                >
                    {option.name}
                </li>
            {/each}
        </ul>
    {/if}
</div>

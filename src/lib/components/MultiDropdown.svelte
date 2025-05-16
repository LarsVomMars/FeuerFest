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
    class="border-primary relative box-border flex w-full cursor-text items-center rounded-md border-2"
    bind:this={div}
>
    <ul class="m-0 flex flex-row rounded-md p-0">
        {#each selected as option (option.value)}
            <li
                role="option"
                aria-selected="true"
                class="m-1 flex cursor-pointer items-center rounded-md p-1 leading-normal whitespace-nowrap"
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
            class="w-fit flex-1 rounded-none border-none bg-transparent outline-none"
        />
    </ul>
    {#if open}
        <ul
            class="dark:bg-dark border-primary absolute top-[100%] left-0 my-1 box-border w-full overflow-auto rounded-md border-2 bg-white p-2 shadow-lg"
        >
            {#each availableOptions as option (option.value)}
                <li
                    onclick={() => selectOption(option)}
                    class="cursor-pointer p-2"
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

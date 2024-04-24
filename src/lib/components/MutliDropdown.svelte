<script lang="ts">
    type Option<T> = {
        value: T;
        name: string;
    };

    type Props<T> = {
        options: Option<T>[];
        selected: Option<T>[];
    };

    export type T = $$Generic;

    let { options, selected }: Props<T> = $props();

    let open = $state(false);
    // TODO: Debug, this doesnt work when bound
    // let availableOptions = $derived(
    //     options.filter((o) => !selected.includes(o)),
    // );
    let availableOptions = $state(options);

    const selectOption = (option: Option<T>) => {
        selected = [...selected, option];
        availableOptions = availableOptions.filter((o) => o !== option);
    };

    const removeOption = (option: Option<T>) => {
        selected = selected.filter((s) => s !== option);
        availableOptions = [...availableOptions, option];
    };
</script>

<div
    class="w-full relative items-center flex cursor-text box-border border-2 border-primary rounded-md"
>
    <ul class="flex flex-1 flex-wrap rounded-md p-0 m-0">
        {#each selected as option}
            <li
                role="option"
                aria-selected="true"
                class="items-center rounded-md flex m-1 leading-normal whitespace-nowrap p-1"
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
            onfocus={() => (open = true)}
            class="border-none outline-none bg-transparent flex-1 rounded-none"
        />
    </ul>
    {#if open}
        <ul
            class="top-[100%] left-0 w-full absolute overflow-auto box-border p-2 m-2"
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

<script lang="ts">
    export let open = false;
    export let title: string;

    const toggle = () => {
        open = !open;
    };

    const kbToggle = (event: KeyboardEvent) => {
        if (event.key === "Enter") toggle();
    };

    $: imagePath = open ? "/icons/chevron-up.svg" : "/icons/chevron-down.svg";
</script>

<div class="w-full p-2 border border-ffred rounded-lg">
    <div
        on:click={toggle}
        on:keypress={kbToggle}
        role="button"
        tabindex="0"
        class="flex flex-row justify-between w-full"
    >
        <h2 class="font-bold select-none text-xl">{title}</h2>
        <img src={imagePath} class="w-5" alt="expand" />
    </div>
    {#if open}
        <hr class="mt-1" />
        <div class="mt-2">
            <slot />
        </div>
    {/if}
</div>

<script lang="ts">
    export let action: () => void;
    export let self = false;

    const actionHandler = (event: Event) => {
        if (
            self &&
            (event.target as HTMLElement).nodeName.toLocaleLowerCase() ===
                "input"
        )
            return;
        action();
    };

    const keypress = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") action();
    };
</script>

<div
    class="w-1/5 p-4 h-30 rounded-lg text-center border-2 border-ffred-dimmed bg-ffred cursor-pointer hover:bg-ffred-dimmed select-none"
    on:click={actionHandler}
    on:keypress={keypress}
    role="button"
    tabindex="0"
>
    <slot />
</div>

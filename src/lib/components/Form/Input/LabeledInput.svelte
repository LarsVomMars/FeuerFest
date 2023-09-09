<script lang="ts">
    import typeAction from "$lib/actions/typeAction";

    export let label: string;
    export let type:
        | "text"
        | "password"
        | "number"
        | "email"
        | "datetime-local" = "text";

    let error: string | undefined = "";

    export let value: string | undefined;
    export let required = false;
    type InputValidator = (value: string | undefined) => string | undefined;
    export let validator: InputValidator = () => undefined;

    const inputValidator = (e: Event) => {
        if (required && !value) error = "Dieses Feld ist erforderlich";
        else error = validator(value);
        const input = e.target as HTMLInputElement;

        if (error) input.setAttribute("data-error", error);
        else input.removeAttribute("data-error");
        // TODO: Input highlighting?
    };

    export let disabled = false;
    let id = label.toLowerCase().replace(" ", "-");
</script>

<div>
    <label
        for={id}
        class="absolute -translate-y-4 translate-x-5 select-none bg-ffdark px-1 text-gray-300"
    >
        {label}
        {#if required}
            <span class="text-ffred-dimmed">*</span>
        {/if}
    </label>
    <input
        use:typeAction={type}
        {id}
        class="w-full rounded-lg border-2 border-ffred bg-transparent p-2 focus:outline-none"
        bind:value
        {disabled}
        {required}
        on:blur={inputValidator}
    />
    {#if error}
        <p class="text-ffred text-xs text-center mt-1">{error}</p>
    {/if}
</div>

<script lang="ts">
    import typeAction from "$lib/actions/typeAction";

    export let label: string;
    export let type:
        | "text"
        | "password"
        | "number"
        | "email"
        | "datetime-local" = "text";

    // Dynamic mapping based on type
    export let value: string | number | Date | undefined;

    export let disabled = false;
    let id = label.toLowerCase().replace(" ", "-");
</script>

<div>
    <label
        for={id}
        class="absolute -translate-y-4 translate-x-5 select-none bg-ffdark px-1 text-gray-300"
    >
        {label}
    </label>
    <input
        use:typeAction={type}
        {id}
        class="w-full rounded-lg border-2 border-ffred bg-transparent p-2 focus:outline-none"
        bind:value
        {disabled}
    />
</div>

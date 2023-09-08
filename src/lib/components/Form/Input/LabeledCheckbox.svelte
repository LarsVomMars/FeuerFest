<script lang="ts">
    export let label: string;

    // Dynamic mapping based on type
    export let checked: boolean;
    export let disabled = false;
    let id = label.toLowerCase().replace(" ", "-");
</script>

<div class="flex flex-row items-center justify-between w-full">
    <label for={id} class="select-none text-gray-300">{label}</label>
    <input
        type="checkbox"
        {id}
        {disabled}
        bind:checked
        class="appearance-none relative w-[3em] h-[1.6em] bg-ffred rounded-[0.2em] cursor-pointer select-none before:content-[''] before:w-[1.2em] before:h-[1.2em] before:rounded-[0.2em] before:bg-ffdark before:block before:absolute before:left-[0.2em] before:top-[0.2em] checked:bg-ffblue checked:before:left-[1.6em] before:transition-all ease-in-out duration-300"
    />
</div>

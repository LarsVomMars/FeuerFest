<script lang="ts">
    type Props = {
        label: string;
        checked: boolean;
        disabled?: boolean;
    };

    let { label, checked = $bindable(), disabled = false }: Props = $props();

    let id = label.toLowerCase().replace(" ", "-");
</script>

<div class="flex flex-row items-center justify-between w-full">
    <label for={id} class="select-none">{label}</label>
    <input
        type="checkbox"
        {id}
        {disabled}
        bind:checked
        class="appearance-none relative w-[3em] h-[1.6em] bg-primary rounded-[0.2em] cursor-pointer select-none before:content-[''] before:w-[1.2em] before:h-[1.2em] before:rounded-[0.2em] before:bg-white dark:before:bg-dark before:block before:absolute before:left-[0.2em] before:top-[0.2em] checked:bg-secondary checked:before:left-[1.6em] before:transition-all ease-in-out duration-300"
    />
</div>

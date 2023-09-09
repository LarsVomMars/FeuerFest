<script lang="ts">
    export let label: string;
</script>

<div>
    <button
        type="submit"
        class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
    >
        {label}
    </button>
</div>

<script lang="ts">
    export let dialog: HTMLDialogElement;

    let classes = "";
    export { classes as class };
</script>

<dialog bind:this={dialog} on:close class="border {classes}">
    <slot />
</dialog>

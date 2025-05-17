<script lang="ts">
    let name = "ASDF";

    let { children = $bindable() } = $props();
</script>

<div>
    asdfffdsa
    {@render children?.(name)}
</div>

<script lang="ts">
    export let value: string;
    export let adornment = "";
</script>

<div class="w-full h-full text-right">
    {parseFloat(value).toFixed(2)}
    {adornment}
</div>

<script lang="ts">
    import Card from "./Card.svelte";

    export let name: string;
    export let description: string;
    export let price: string;
    export let action: () => void;
</script>

<Card {action}>
    <h2 class="font-bold text-xl">{name}</h2>
    <div>{description}</div>
    <div>{price}€</div>
</Card>

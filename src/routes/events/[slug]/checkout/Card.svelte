<script lang="ts">
    type Props = {
        id: number;
        name: string;
        description: string;
        price: number;
        textColor: string;
        backgroundColor: string;
        onclick?: () => void;
    };

    let {
        id,
        name,
        description,
        price,
        textColor,
        backgroundColor,
        onclick,
    }: Props = $props();
</script>

<button
    style="color: {textColor}; background-color: {backgroundColor}"
    class="w-1/5 rounded-lg m-2 p-2 h-32 shadow-md"
    {onclick}
>
    <h2 class="text-2xl font-bold">{name}</h2>
    <p>{description}</p>
    <p>{price}€</p>
</button>

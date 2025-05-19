<script lang="ts">
    import { euroMask } from "$lib/actions/mask";
    import Form, {
        ColorInput,
        DropDown,
        SubmitButton,
        TextInput,
    } from "$lib/components/form";
    import type { RouterInputs } from "$lib/trpc";

    const options = [
        { label: "", value: "", disabled: true },
        {
            label: "Trinken",
            value: "DRINK",
        },
        {
            label: "Essen",
            value: "FOOD",
        },
        {
            label: "Bar",
            value: "BAR",
        },
    ];

    let {
        add,
    }: {
        add: (
            data: Omit<RouterInputs["events"]["products"]["create"], "slug">,
        ) => void;
    } = $props();

    const submit = () => {
        const parsedPrice = parseFloat(price);
        add({
            name,
            description,
            price: parsedPrice,
            type: type as "DRINK" | "FOOD" | "BAR",
            backgroundColor,
            textColor,
        });
        name = "";
        description = "";
        price = "";
        type = "";
        textColor = "";
        backgroundColor = "";
    };

    let name = $state("");
    let description = $state("");
    let price = $state("");
    let type = $state("");
    let textColor = $state("");
    let backgroundColor = $state("");
</script>

<details class="w-1/3 p-2 select-none">
    <summary class="cursor-pointer text-center text-2xl font-bold">
        Neues Produkt
    </summary>
    <Form {submit}>
        <TextInput label="Name" bind:value={name} required />
        <TextInput label="Beschreibung" bind:value={description} />
        <TextInput
            label="Preis"
            bind:value={price}
            required
            oninput={(e) =>
                console.log((e.currentTarget as HTMLInputElement).value)}
            {@attach euroMask}
        />
        <DropDown label="Art" bind:value={type} required {options} />
        <ColorInput label="Textfarbe" bind:value={textColor} required />
        <ColorInput
            label="Hintergrundfarbe"
            bind:value={backgroundColor}
            required
        />
        <SubmitButton text="Hinzufügen" />
    </Form>
</details>

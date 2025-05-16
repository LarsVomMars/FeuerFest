<script lang="ts">
    import { longpress } from "$lib/actions/longpress";
    import Form from "$lib/components/form";
    import { NumberInput, SubmitButton } from "$lib/components/form/inputs";

    type Props = {
        id: number;
        name: string;
        description: string;
        price: number;
        textColor: string;
        backgroundColor: string;
        onclick?: (count: number) => void;
    };

    let {
        id: _id,
        name,
        description,
        price,
        textColor,
        backgroundColor,
        onclick,
    }: Props = $props();

    let dialog = $state<HTMLDialogElement>();
    let count = $state(undefined);
</script>

<button
    style="color: {textColor}; background-color: {backgroundColor}"
    class="m-2 h-32 w-1/5 rounded-lg p-2 shadow-md"
    onclick={() => onclick?.(1)}
    use:longpress
    onlongpress={() => {
        dialog?.showModal();
    }}
>
    <h2 class="text-2xl font-bold">{name}</h2>
    <p>{description}</p>
    <p>{price.toFixed(2)}€</p>
</button>

<dialog
    bind:this={dialog}
    class="dark:bg-dark fixed flex h-1/4 w-1/4 translate-3/2 flex-col items-center justify-center gap-4 border p-4 dark:text-white [&:not([open])]:hidden"
>
    <Form
        submit={() => {
            dialog?.close();
            onclick?.(+(count || 0));
        }}
    >
        <NumberInput bind:value={count} label="Anzahl" />
        <SubmitButton text="Hinzufügen" />
    </Form>
</dialog>

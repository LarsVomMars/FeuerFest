<script lang="ts">
    import LabeledCheckbox from "$lib/components/Form/Input/LabeledCheckbox.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";

    let name: string;
    let username: string;
    let email: string;
    let dummy: boolean = false;

    let disabled = false;

    const createRequest = trpc.users.create.mutation();

    const submit = () => {
        $createRequest.mutate({ name, username, email, dummy });
    };
</script>

<h1 class="font-bold text-4xl">Neuer Benutzer</h1>
<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <LabeledInput label="Name" bind:value={name} />
    <LabeledInput label="Benutzername" bind:value={username} />
    <LabeledInput label="Email" bind:value={email} type="email" />
    <LabeledCheckbox label="Dummy Benutzer" bind:checked={dummy} />

    <div>
        <button
            type="submit"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
            {disabled}
        >
            Setup
        </button>
    </div>
</form>

<script lang="ts">
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledCheckbox from "$lib/components/Form/Input/LabeledCheckbox.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let name: string;
    let username: string;
    let email: string;
    let dummy: boolean = false;

    let error = "";

    const createRequest = trpc.users.create.mutation({
        onError: (err) => (error = err.message),
    });

    const submit = () => {
        $createRequest.mutate({ name, username, email, dummy });
    };
</script>

<h1 class="font-bold text-4xl">Neuer Benutzer</h1>
<Form {submit} {error}>
    <LabeledInput label="Name" bind:value={name} required={true} />
    <LabeledInput label="Benutzername" bind:value={username} required={true} />
    <LabeledInput
        label="Email"
        bind:value={email}
        type="email"
        required={true}
    />
    <LabeledCheckbox label="Dummy Benutzer" bind:checked={dummy} />

    <Submit label="Erstellen" />
</Form>

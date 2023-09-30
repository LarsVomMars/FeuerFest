<script lang="ts">
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let error = "";

    const createUser = trpc.setup.createUser.mutation({
        onSuccess: () => {
            trpc.setup.isSetup.utils.invalidate();
            trpc.setup.isSetup.query();
        },
        onError: (err) => (error = err.message),
    });

    let name = "";
    let email = "";
    let username = "";

    let disabled = false;

    const submit = () => {
        if (disabled) return;
        disabled = true;
        $createUser.mutate({ name, username, email });
    };
</script>

<h1 class="text-4xl font-bold">Setup</h1>

<Form {submit} {error}>
    <LabeledInput label="Name" bind:value={name} required />
    <LabeledInput label="Username" bind:value={username} required />
    <LabeledInput label="Email" bind:value={email} type="email" required />
    <Submit label="Erstellen" />
</Form>

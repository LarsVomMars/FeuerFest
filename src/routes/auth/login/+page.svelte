<script lang="ts">
    import { goto } from "$app/navigation";
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let username = "";
    let password = "";

    let error = "";

    const loginRequest = trpc.auth.login.mutation({
        onSuccess: () => goto("/"),
        onError: (err) => (error = err.message),
    });

    const submit = () => {
        $loginRequest.mutate({ username, password });
    };
</script>

<h1 class="text-4xl font-bold">Anmelden</h1>

<Form {submit} {error}>
    <LabeledInput label="Benutzername" bind:value={username} required={true} />
    <LabeledInput
        label="Passwort"
        bind:value={password}
        type="password"
        required={true}
    />
    <Submit label="Anmelden" />
</Form>

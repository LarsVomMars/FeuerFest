<script lang="ts">
    import { trpc } from "$lib/trpc";
    import { page } from "$app/stores";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { goto } from "$app/navigation";
    import Form from "$lib/components/Form/Form.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";

    let token = $page.params.token || "";
    let error = "";

    const userRequest = trpc.auth.validateToken.query({ token });
    const activateRequest = trpc.auth.activate.mutation({
        onSuccess: () => goto("/"),
        onError: (err) => (error = err.message),
    });

    let fetched = false;

    let name = "";
    let username = "";
    let email = "";
    let password = "";
    let validatePassword = "";

    if ($userRequest.isSuccess && !fetched) {
        fetched = true;
        name = $userRequest.data?.name;
        username = $userRequest.data?.username;
        email = $userRequest.data?.email;
    }

    let disabled = false;

    const submit = () => {
        $activateRequest.mutate({
            name,
            username,
            email,
            password,
            validatePassword,
            token,
        });
    };

    const passwordValidator = (value: string | undefined) => {
        if (value && value.length < 8)
            return "Das Passwort muss mindestens 8 Zeichen lang sein";
        if (password !== validatePassword)
            return "Die Passwörter stimmen nicht überein";
    };
</script>

<h1 class="text-4xl font-bold">Aktivieren</h1>

<Form {submit} {error}>
    <LabeledInput label="Name" bind:value={name} required />
    <LabeledInput label="Benutzername" bind:value={username} required />
    <LabeledInput label="Email" bind:value={email} type="email" required />
    <LabeledInput
        label="Passwort"
        bind:value={password}
        type="password"
        required
        validator={passwordValidator}
    />
    <LabeledInput
        label="Passwort bestätigen"
        bind:value={validatePassword}
        type="password"
        required
        validator={passwordValidator}
    />
    <Submit label="Aktivieren" />
</Form>

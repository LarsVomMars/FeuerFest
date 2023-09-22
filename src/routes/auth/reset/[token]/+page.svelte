<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let password = "";
    let validatePassword = "";

    const resetRequest = trpc.auth.resetPassword.mutation({
        onSuccess: () => goto("/auth/login"),
    });

    const submit = async () => {
        $resetRequest.mutate({
            password,
            validatePassword,
            token: $page.params.token || "",
        });
    };

    const passwordValidator = (value: string | undefined) => {
        if (value && value.length < 8)
            return "Das Passwort muss mindestens 8 Zeichen lang sein";
        if (password !== validatePassword)
            return "Die Passwörter stimmen nicht überein";
    };
</script>

<Form {submit}>
    <LabeledInput
        label="Neues Passwort"
        type="password"
        required
        bind:value={password}
        validator={passwordValidator}
    />
    <LabeledInput
        label="Passwort bestätigen"
        type="password"
        required
        bind:value={validatePassword}
        validator={passwordValidator}
    />
    <Submit label="Passwort zurücksetzen" />
</Form>

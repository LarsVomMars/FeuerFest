<script lang="ts">
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let currentPassword = "";
    let newPassword = "";
    let validateNewPassword = "";

    let error = "";

    const updateRequest = trpc.users.updatePassword.mutation({
        onError: (err) => (error = err.message),
    });

    const submit = () => {
        $updateRequest.mutate({
            currentPassword,
            newPassword,
            validateNewPassword,
        });
    };

    const passwordValidator = (value: string | undefined) => {
        if (value && value.length < 8)
            return "Das Passwort muss mindestens 8 Zeichen lang sein";
        if (newPassword !== validateNewPassword)
            return "Die Passwörter stimmen nicht überein";
    };

    const minLengthValidator = (value: string | undefined) => {
        if (value && value.length < 8)
            return "Das Passwort muss mindestens 8 Zeichen lang sein";
    };
</script>

<Form {submit} {error}>
    <LabeledInput
        label="Altes Passwort"
        bind:value={currentPassword}
        required={true}
        validator={minLengthValidator}
    />
    <LabeledInput
        label="Neues Passwort"
        bind:value={newPassword}
        required={true}
        validator={passwordValidator}
    />
    <LabeledInput
        label="Neues Passwort wiederholen"
        bind:value={validateNewPassword}
        required={true}
        validator={passwordValidator}
    />
    <Submit label="Ändern" />
</Form>

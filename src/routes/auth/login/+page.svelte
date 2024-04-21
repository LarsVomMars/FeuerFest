<script lang="ts">
    import Form, { PasswordInput, SubmitButton, TextInput } from "$lib/components/form";
    import { trpc } from "$lib/trpc";


    const loginRequest = trpc.auth.login.mutation();


    const submit = () => {
        $loginRequest.mutate({
            username,
            password,
        });
    };

    let username = $state("");
    let password = $state("");
</script>

<Form {submit}>
    <TextInput bind:value={username} label="Username" />
    <PasswordInput bind:value={password} label="Password" />
    <SubmitButton text="Login" />
</Form>
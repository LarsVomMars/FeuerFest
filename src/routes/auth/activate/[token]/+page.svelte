<script lang="ts">
    import { page } from "$app/stores";
    import Form, {
        TextInput,
        EmailInput,
        PasswordInput,
        SubmitButton,
    } from "$lib/components/form";
    import { trpc } from "$lib/trpc";

    const token = $page.params.token || "";
    const tokenRequest = trpc.auth.validateActivationToken.query({ token });
    const activateRequest = trpc.auth.activate.mutation({
        onSuccess: () => {
            console.log("Success");
        },
        onError: console.error,
    });

    const submit = () => {
        $activateRequest.mutate({
            username,
            name,
            email,
            password,
            validatePassword,
            token,
        });
    };

    let username = $state($tokenRequest.data?.username || "");
    let name = $state($tokenRequest.data?.name || "");
    let email = $state($tokenRequest.data?.email || "");
    let password = $state("");
    let validatePassword = $state("");
</script>

<div class="w-2/3 max-w-screen-sm">
    <Form {submit}>
        <TextInput bind:value={name} label="Name" />
        <TextInput bind:value={username} label="Username" />
        <EmailInput bind:value={email} label="Email" />
        <PasswordInput bind:value={password} label="Password" />
        <PasswordInput bind:value={validatePassword} label="Confirm Password" />
        <SubmitButton text="Activate" />
    </Form>
</div>

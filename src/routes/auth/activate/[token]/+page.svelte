<script lang="ts">
    import { trpc } from "$lib/trpc";
    import { page } from "$app/stores";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { goto } from "$app/navigation";

    let token = $page.params.token || "";

    const userRequest = trpc.auth.validateToken.query({ token });
    const activateRequest = trpc.auth.activate.mutation({
        onSuccess: () => {
            goto("/auth/login");
        },
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
</script>

<h1 class="text-4xl font-black">Aktivieren</h1>

<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <LabeledInput label="Name" bind:value={name} />
    <LabeledInput label="Benutzername" bind:value={username} />
    <LabeledInput label="Email" bind:value={email} type="email" />
    <LabeledInput label="Passwort" bind:value={password} type="password" />
    <LabeledInput
        label="Passwort bestätigen"
        bind:value={validatePassword}
        type="password"
    />
    <div>
        <button
            type="submit"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
            {disabled}
        >
            Aktivieren
        </button>
    </div>
</form>

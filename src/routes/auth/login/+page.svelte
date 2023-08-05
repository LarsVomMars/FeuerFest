<script lang="ts">
    import { goto } from "$app/navigation";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";
    import { setSession } from "$lib/util/cookie";
    let username = "";
    let password = "";

    let disabled = false;

    const loginRequest = trpc.auth.login.mutation({
        onSuccess: ({ token }) => {
            setSession(token);
            goto("/");
        },
    });

    const submit = () => {
        $loginRequest.mutate({ username, password });
    };
</script>

<h1 class="text-4xl font-black">Anmelden</h1>

<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <LabeledInput label="Benutzername" bind:value={username} />
    <LabeledInput label="Passwort" bind:value={password} type="password" />
    <div>
        <button
            type="submit"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
            {disabled}
        >
            Anmelden
        </button>
    </div>
</form>

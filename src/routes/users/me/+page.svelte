<script lang="ts">
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";
    import { setSession } from "$lib/util/cookie";

    const meRequest = trpc.users.me.query();
    const updateRequest = trpc.users.updateMe.mutation({
        onSuccess: (token) => setSession(token),
    });

    $: id = $meRequest.data?.id!;
    let name = "";
    let username = ""; // TODO: Make non-nullable
    let email = "";

    let fetched = false;

    $: if ($meRequest.isSuccess && !fetched) {
        name = $meRequest.data?.name;
        username = $meRequest.data?.username ?? "";
        email = $meRequest.data?.email;
        fetched = true;
    }

    const refetch = () => {
        $meRequest.refetch();
        fetched = false;
        edit = false;
    };

    const updateEdit = () => {
        if (edit) {
            $updateRequest.mutate({ id, name, username, email });
        }
        edit = !edit;
    };

    let edit = false;
    $: disabled = !edit;
</script>

<h1 class="text-4xl font-black">Benutzer</h1>

{#key $meRequest.isFetching}
    <form
        class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
        autocomplete="off"
        on:submit|preventDefault|stopPropagation
    >
        <LabeledInput label="Name" bind:value={name} bind:disabled />
        <LabeledInput
            label="Benutzername"
            bind:value={username}
            bind:disabled
        />
        <LabeledInput
            label="E-Mail"
            bind:value={email}
            type="email"
            bind:disabled
        />
        <div class="flex flex-col gap-4">
            <div class="flex flex-row justify-between gap-x-2">
                <button
                    class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed"
                    on:click={updateEdit}
                >
                    {edit ? "Speichern" : "Bearbeiten"}
                </button>
                <button
                    class="w-full rounded-lg bg-ffred p-2 hover:bg-ffred-dimmed {edit
                        ? 'block'
                        : 'hidden'}"
                    on:click={refetch}
                >
                    Abbrechen
                </button>
            </div>

            <a
                class="w-full rounded-lg bg-ffred p-2 hover:bg-ffred-dimmed text-center cursor-pointer"
                href="/users/me/password"
            >
                Passwort ändern
            </a>
        </div>
    </form>
{/key}

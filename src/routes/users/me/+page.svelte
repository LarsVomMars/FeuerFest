<script lang="ts">
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";

    const meRequest = trpc.users.me.query();
    const updateRequest = trpc.users.updateMe.mutation({
        onSuccess: () => {
            $meRequest.refetch();
        },
        onError: (err) => (error = err.message),
    });

    $: id = $meRequest.data?.id!;
    let name = "";
    let username = "";
    let email = "";

    let fetched = false;
    let error = "";

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

<h1 class="text-4xl font-bold">Benutzer</h1>

{#key $meRequest.isFetching}
    <Form submit={() => {}} {error}>
        <LabeledInput
            label="Name"
            bind:value={name}
            {disabled}
            required={true}
        />
        <LabeledInput
            label="Benutzername"
            bind:value={username}
            {disabled}
            required={true}
        />
        <LabeledInput
            label="E-Mail"
            bind:value={email}
            type="email"
            {disabled}
            required={true}
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
    </Form>
{/key}

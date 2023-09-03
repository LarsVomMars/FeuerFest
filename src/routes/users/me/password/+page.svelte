<script lang="ts">
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";

    let currentPassword = "";
    let newPassword = "";
    let validateNewPassword = "";

    const updateRequest = trpc.users.updatePassword.mutation();

    const updatePassword = () => {
        $updateRequest.mutate({
            currentPassword,
            newPassword,
            validateNewPassword,
        });
    };
</script>

<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={updatePassword}
>
    <LabeledInput label="Altes Passwort" bind:value={currentPassword} />
    <LabeledInput label="Neues Passwort" bind:value={newPassword} />
    <LabeledInput
        label="Neues Passwort wiederholen"
        bind:value={validateNewPassword}
    />
    <div class="flex flex-row justify-between gap-x-2">
        <button class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed">
            Ändern
        </button>
    </div>
</form>

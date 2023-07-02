<script lang="ts">
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    let username = "";
    let password = "";

    let disabled = false;

    const submit = () => {};
</script>

<h1 class="text-3xl font-bold">Anmelden</h1>

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

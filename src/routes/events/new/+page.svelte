<script lang="ts">
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";

    let name: string;
    let description: string;
    let location: string;
    let start: Date;
    let end: Date;

    let disabled = false;

    const createRequest = trpc.events.create.mutation({
        onSuccess: (slug) => {
            // TODO: Redirect
            console.log(slug);
        },
    });

    const submit = () => {
        if (disabled) return;
        disabled = true;

        $createRequest.mutate({
            name,
            description,
            location,
            start: new Date(start),
            end: new Date(end),
        });
    };
</script>

<h1 class="text-4xl font-black">Neue Veranstaltung</h1>

<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <LabeledInput label="Name" bind:value={name} />
    <LabeledInput label="Beschreibung" bind:value={description} />
    <LabeledInput label="Ort" bind:value={location} />
    <LabeledInput label="Start" type="datetime-local" bind:value={start} />
    <LabeledInput label="Ende" type="datetime-local" bind:value={end} />
    <div>
        <button
            type="submit"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
            {disabled}
        >
            Erstellen
        </button>
    </div>
</form>

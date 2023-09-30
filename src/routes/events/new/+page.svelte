<script lang="ts">
    import { goto } from "$app/navigation";
    import Form from "$lib/components/Form/Form.svelte";
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import Submit from "$lib/components/Form/Submit.svelte";
    import { trpc } from "$lib/trpc";

    let name: string;
    let description: string;
    let location: string;
    let start: string;
    let end: string;

    let error = "";

    const createRequest = trpc.events.create.mutation({
        onSuccess: (slug) => goto(`/events/${slug}`),
        onError: (err) => (error = err.message),
    });

    const submit = () => {
        $createRequest.mutate({
            name,
            description,
            location,
            start: new Date(start),
            end: new Date(end),
        });
    };
</script>

<h1 class="text-4xl font-bold">Neue Veranstaltung</h1>

<Form {submit} {error}>
    <LabeledInput label="Name" bind:value={name} required />
    <LabeledInput label="Beschreibung" bind:value={description} required />
    <LabeledInput label="Ort" bind:value={location} required />
    <LabeledInput
        label="Start"
        type="datetime-local"
        bind:value={start}
        required
    />
    <LabeledInput
        label="Ende"
        type="datetime-local"
        bind:value={end}
        required
    />
    <Submit label="Erstellen" />
</Form>

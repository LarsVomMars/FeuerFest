<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import Form, { TextInput, DateTimeInput, SubmitButton } from "$lib/components/form";
    import { trpc } from "$lib/trpc";

    const createEventRequest = trpc.events.create.mutation();

    const submit = () => {
        $createEventRequest.mutate({
            name,
            description,
            location,
            start: new Date(start),
            end: new Date(end),
        });
    };

    let name = $state("");
    let description = $state("");
    let location = $state("");

    let start = $state("");
    let end = $state("");
</script>

<Heading title="New Event" />

<div class="w-2/3 max-w-screen-sm">
    <Form {submit}>
        <TextInput bind:value={name} label="Name" required />
        <TextInput bind:value={description} label="Description" />
        <TextInput bind:value={location} label="Location" required />
        <DateTimeInput bind:value={start} label="Start" required />
        <DateTimeInput bind:value={end} label="End" required />
        <SubmitButton text="Create" />
    </Form>
</div>

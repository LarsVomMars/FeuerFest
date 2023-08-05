<script lang="ts">
    import LabeledInput from "$lib/components/Form/Input/LabeledInput.svelte";
    import { trpc } from "$lib/trpc";

    const createUser = trpc.setup.createUser.mutation({
        onSuccess: () => {
            trpc.setup.isSetup.utils.invalidate();
            trpc.setup.isSetup.query();
        },
    });

    let name = "";
    let email = "";

    let disabled = false;

    const submit = () => {
        if (disabled) return;
        disabled = true;
        $createUser.mutate({ name, email });
    };
</script>

<h1 class="text-4xl font-black">Setup</h1>

<form
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <LabeledInput label="Name" bind:value={name} />
    <LabeledInput label="Email" bind:value={email} type="email" />
    <div>
        <button
            type="submit"
            class="w-full rounded-lg bg-ffblue p-2 hover:bg-ffblue-dimmed disabled:bg-ffblue-dark"
            {disabled}
        >
            Setup
        </button>
    </div>
</form>

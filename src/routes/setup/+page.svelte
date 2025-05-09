<script lang="ts">
    // import Form, {
    //     TextInput,
    //     EmailInput,
    //     SubmitButton,
    // } from "$lib/components/form";
    import TextInput from "$lib/components/form/inputs/TextInput.svelte";
    import SubmitButton from "$lib/components/form/inputs/SubmitButton.svelte";
    import { trpc } from "$lib/trpc";

    let email = $state("");
    let name = $state("");
    let username = $state("");

    const setupRequest = trpc.setup.createUser.mutation({
        onSuccess: () => {
            console.log("Success");
        },
        onError: console.error,
    });

    const submit = () => {
        $setupRequest.mutate({
            email,
            name,
            username,
        });
    };
</script>

<div class="w-2/3 max-w-screen-sm">
    <!-- <Form {submit}> -->
        <TextInput bind:value={name} label="Name" />
        <!-- <TextInput bind:value={username} label="Username" /> -->
        <!-- <EmailInput bind:value={email} label="Email" /> -->
         <div>
            asdf
         </div>
        <SubmitButton text="Setup" />
    <!-- </Form> -->
</div>
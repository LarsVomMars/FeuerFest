<script lang="ts">
    import { trpc } from "$lib/trpc";


    const loginRequest = trpc.login.mutation();


    const submit = () => {
        $loginRequest.mutate({
            username,
            password,
        });
    };

    let username = $state("");
    let password = $state("");
</script>

<form on:submit|preventDefault={submit}>
    <input class="p-2 m-2 border-black border-2" type="text" bind:value={username}>
    <input class="p-2 m-2 border-black border-2" type="password" bind:value={password}>
    <button class="p-2 m-2 border-black border-2" type="submit">Login</button>
    {#if $loginRequest.error}
        <p>{$loginRequest.error.message}</p>
    {/if}
    {#if $loginRequest.data}
        <p>Logged in!</p>
    {/if}
</form>
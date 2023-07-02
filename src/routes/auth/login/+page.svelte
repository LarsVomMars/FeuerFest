<script lang="ts">
    let username = "";
    let password = "";

    let disabled = false;

    const submit = () => {};
</script>

<h1 class="text-3xl font-bold">Anmelden</h1>

<form
    class="m-4 w-[40%] gap-4 space-y-8 p-4 max-w-[32rem]"
    autocomplete="off"
    on:submit|preventDefault|stopPropagation={submit}
>
    <div>
        <label
            for="username"
            class="absolute -translate-y-4 translate-x-5 select-none bg-ffdark px-1 text-gray-300"
        >
            Name
        </label>
        <input
            type="text"
            id="username"
            class="w-full rounded-lg border-2 border-ffred bg-transparent p-2 focus:outline-none"
            bind:value={username}
        />
    </div>
    <div>
        <label
            for="password"
            class="absolute -translate-y-4 translate-x-5 select-none bg-ffdark px-1 text-gray-300"
        >
            Passwort
        </label>
        <input
            type="password"
            id="password"
            class="w-full rounded-lg border-2 border-ffred bg-transparent p-2 focus:outline-none"
            bind:value={password}
        />
    </div>
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

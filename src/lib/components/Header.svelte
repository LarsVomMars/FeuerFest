<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { clearSession } from "$lib/util/cookie";
    import { onMount } from "svelte";

    let dropdown: HTMLDivElement;

    let isOpen = false;
    const profile = () => {
        if (!isOpen) {
            dropdown.classList.add("flex");
            dropdown.classList.remove("hidden");
            setTimeout(() => (isOpen = true), 50);
        } else {
            dropdown.classList.remove("flex");
            dropdown.classList.add("hidden");
            isOpen = false;
        }
    };

    const logout = () => {
        clearSession();
        goto("/auth/login");
    };

    onMount(() => {
        if (browser) {
            document.addEventListener("click", (e) => {
                if (!dropdown.contains(e.target as Node) && isOpen) {
                    isOpen = false;
                    dropdown.classList.remove("flex");
                    dropdown.classList.add("hidden");
                }
            });
        }
    });

    export let isLoggedIn = true;
</script>

<header
    class="flex h-16 w-full select-none flex-row justify-between bg-ffred text-white overflow-hidden fixed"
>
    <h1 class="m-2 cursor-pointer text-4xl font-bold text-white">
        <a href="/">FeuerFest</a>
    </h1>

    <div class="w-32 h-16">
        <span
            class="w-4 h-24 bg-white absolute -rotate-[30deg] -translate-y-4 left-[13rem]"
        ></span>
        <span
            class="w-4 h-24 bg-white absolute -rotate-[30deg] -translate-y-4 left-[15rem]"
        ></span>
    </div>

    {#if isLoggedIn}
        <button on:click={profile}>
            <img
                src="/icons/user.svg"
                alt="Profile"
                class="m-2 cursor-pointer"
                width="32"
                height="32"
            />
        </button>

        <div
            class="fixed right-0 top-16 hidden h-40 w-40 flex-col items-center justify-between border-t border-t-black bg-ffred z-50"
            bind:this={dropdown}
        >
            <a
                href="/users/me"
                class="p-2 hover:text-gray-200"
                on:click={profile}>Profil</a
            >
            <div class="p-2">Sprache</div>
            <div class="p-2">Dunkler Modus</div>
            <button on:click={logout} class="p-2 hover:text-gray-200">
                Abmelden
            </button>
        </div>
    {/if}
</header>

<script lang="ts">
    export let submit: () => void;
    export let error = "";

    type Elements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    const submitForm = (e: Event) => {
        error = "";
        let hasError = false;
        const inputs = (e.target as HTMLFormElement).querySelectorAll<Elements>(
            "input, select, textarea",
        );
        for (const input of inputs) {
            input.dispatchEvent(new Event("blur"));
            const fieldError = input.hasAttribute("data-error");
            if (fieldError && !hasError) input.focus();
            hasError ||= fieldError;
        }

        if (hasError) return;
        submit();
    };

    let className = "";
    export { className as class };
</script>

<form
    on:submit|preventDefault|stopPropagation={submitForm}
    novalidate
    autocomplete="off"
    class="m-4 w-[40%] max-w-[32rem] gap-4 space-y-8 p-4 {className}"
>
    <slot />

    {#if error}
        <p class="text-ffred text-center">{error}</p>
    {/if}
</form>

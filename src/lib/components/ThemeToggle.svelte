<script lang="ts">
    const toggleTheme = () => {
        if (input!.checked) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkmode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkmode", "false");
        }
    };
    let input = $state<HTMLInputElement>();
</script>

<div>
    <input
        type="checkbox"
        id="theme-toggle"
        class="bg-dark cursor-pointer appearance-none rounded-full p-6 dark:bg-white"
        onchange={toggleTheme}
        bind:this={input}
    />
</div>

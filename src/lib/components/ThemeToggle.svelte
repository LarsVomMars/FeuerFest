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
        class="appearance-none p-6 bg-dark dark:bg-white rounded-full cursor-pointer"
        onchange={toggleTheme}
        bind:this={input}
    />
</div>

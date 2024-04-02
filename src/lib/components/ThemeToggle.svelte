<script lang="ts">
    function toggleDarkmode() {
        const current = document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", !current);
        localStorage.setItem("darkmode", "" + !current);
    }
</script>

<div>
    <label for="theme-toggle">Dark Mode</label>
    <input type="checkbox" id="theme-toggle" onclick={toggleDarkmode} />
</div>

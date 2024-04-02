const darkmode = localStorage.getItem("darkmode");
if (darkmode) {
    if (darkmode === "true") {
        document.documentElement.classList.add("dark");
    }
} else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkmode", "true");
    }
}

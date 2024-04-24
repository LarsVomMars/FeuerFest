const darkmode = localStorage.getItem("darkmode");
let value = false;
if (darkmode) {
    if (darkmode === "true") {
        document.documentElement.classList.add("dark");
        value = true;
    }
} else {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkmode", "true");
        value = true;
    }
}

const toggle = document.getElementById("theme-toggle");
if (toggle) {
    toggle.checked = value;
    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkmode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkmode", "false");
        }
    });
}

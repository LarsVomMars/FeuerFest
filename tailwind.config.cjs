/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
                ffred: {
                    DEFAULT: "#dd2e44",
                    dimmed: "#b22538",
                },
                ffblue: {
                    DEFAULT: "#55acee",
                    dimmed: "#4993cc",
                    dark: "#4080b2",
                },
                ffdark: {
                    DEFAULT: "#363636",
                },
            },
        },
    },
    plugins: [],
    darkMode: "class",
};

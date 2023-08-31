/// <reference types="@sveltejs/kit" />

declare namespace App {
    // interface Platform {}
    interface Locals {
        request?: import("$lib/auth").Request;
    }
    // interface Error {}
    // interface Session {}
    // interface Stuff {}
}

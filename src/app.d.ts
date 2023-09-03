/// <reference types="@sveltejs/kit" />

declare namespace App {
    // interface Platform {}
    interface Locals {
        request: import("$lib/server/auth").Request;
    }
    // interface Error {}
    // interface Session {}
    // interface Stuff {}
}

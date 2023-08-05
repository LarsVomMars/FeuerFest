/// <reference types="@sveltejs/kit" />

declare namespace App {
    // interface Platform {}
    interface Locals {
        user?: import("$lib/util/tokens").SessionToken;
    }
    // interface Error {}
    // interface Session {}
    // interface Stuff {}
}

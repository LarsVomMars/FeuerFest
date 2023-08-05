import { browser } from "$app/environment";

const SESSION_KEY = "session";

export const setSession = (session: string) => {
    if (!browser) return;
    document.cookie = `${SESSION_KEY}=${session};path=/;samesite=strict;max-age=86400`;
};

export const clearSession = () => {
    if (!browser) return;
    document.cookie = `${SESSION_KEY}=;path=/;samesite=strict;max-age=0`;
};

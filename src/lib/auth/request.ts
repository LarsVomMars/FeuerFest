import type { Session } from "./session";

export class Request {
    constructor() {
        console.log("Request");
    }

    public get session(): Session {
        return {
            id: "123",
        };
    }
}

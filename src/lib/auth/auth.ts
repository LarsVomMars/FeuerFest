import type { RequestEvent } from "@sveltejs/kit";
import { Request } from "./request";

export class Auth {
    public handleRequest(_event: RequestEvent): Request {
        return new Request();
    }
}

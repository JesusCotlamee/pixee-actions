import {UserError} from "./util";

export interface Repository {
    owner: string;
    repo: string;
}

export function parseRepository(input: string): Repository {
    const parts = input.split("/");
    if (parts.length !== 2) {
        throw new UserError(`"${input}" is not a valid repository name`);
    }
    console.log('parts: ', parts)
    return {
        owner: parts[0],
        repo: parts[1],
    };
}

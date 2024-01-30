import {UploadInputs} from "./upload-inputs";

export const AUDIENCE = 'https://app.pixee.ai'

export interface Repository {
    owner: string;
    repo: string;
}

export function buildApiUrl(inputs: UploadInputs): string {
    const sha = getRequiredEnvParam("GITHUB_SHA")
    const {owner, repo} = parseRepository(getRequiredEnvParam("GITHUB_REPOSITORY"))

    return `${inputs.url}/analysis-input/${owner}/${repo}/${sha}/${inputs.tool}`
}

export function wrapError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export class UserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export function getRequiredEnvParam(paramName: string): string {
    const value = process.env[paramName];
    if (value === undefined || value.length === 0) {
        throw new Error(`${paramName} environment variable must be set`);
    }
    return value;
}

export function parseRepository(input: string): Repository {
    const parts = input.split("/");
    if (parts.length !== 2) {
        throw new UserError(`"${input}" is not a valid repository name`);
    }
    return {
        owner: parts[0],
        repo: parts[1],
    };
}

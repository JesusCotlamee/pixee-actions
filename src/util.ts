import {parseRepository} from "./repository";

export const AUDIENCE = 'https://app.pixee.ai'

export function buildApiUrl(api: string): string {
    const sha = getRequiredEnvParam("GITHUB_SHA")
    const {owner, repo} = parseRepository(getRequiredEnvParam("GITHUB_REPOSITORY"))

    return `${api}/analysis-input/${owner}/${repo}/${sha}/sonar}`
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

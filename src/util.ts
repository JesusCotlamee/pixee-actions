import {UploadInputs} from "./upload-inputs";
import * as core from "@actions/core";

const PIXEE_SAMBOX_URL = 'https://d22balbl18.execute-api.us-east-1.amazonaws.com/prod'

export interface Repository {
    owner: string;
    repo: string;
}

export function buildApiUrl(inputs: UploadInputs): string {
    const {url, tool} = inputs
    const sha = getRequiredEnvParam("GITHUB_SHA")
    const {owner, repo} = parseRepository(getRequiredEnvParam("GITHUB_REPOSITORY"))

    const customUrl = url ?? PIXEE_SAMBOX_URL
    return `${customUrl}/analysis-input/${owner}/${repo}/${sha}/${tool}`
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

export function wrapError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export function buildError(unwrappedError: unknown) {
    const error = wrapError(unwrappedError);
    const message = error.message;
    core.setFailed(message);
    return;
}

export class UserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

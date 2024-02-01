import {UploadInputs} from "./upload-inputs";
import * as core from "@actions/core";
import * as github from '@actions/github';

const PIXEE_SAMBOX_URL = 'https://d22balbl18.execute-api.us-east-1.amazonaws.com/prod'

export function buildApiUrl(inputs: UploadInputs): string {
    const {url, tool} = inputs
    const { sha, repo: { owner, repo}} = github.context

    const customUrl = url ? url : PIXEE_SAMBOX_URL
    return `${customUrl}/analysis-input/${owner}/${repo}/${sha}/${tool}`
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

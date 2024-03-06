import * as core from "@actions/core";
import * as github from '@actions/github';
import {Context} from "node:vm";
import {GitHubContext, GitHubEvent, PIXEE_URL, SonarCloudInputs, VALID_EVENTS} from "./shared";

const eventHandlers: { [eventName: string]: (context: Context) => Pick<GitHubContext, "prNumber" | "sha"> } = {
    'check_run': getCheckRunContext,
    'pull_request': getPullRequestContext,
    'push': getPushContext
};

export function buildSonarcloudUrl(inputs: SonarCloudInputs): string {
    const {apiUrl, componentKey} = inputs
    const {owner, repo, prNumber} = getGitHubContext()
    const defaultComponentKey = componentKey ? componentKey : `${owner}_${repo}`
    let URL = `${apiUrl}/issues/search?componentKeys=${defaultComponentKey}&resolved=false`

    if(prNumber){
        URL = `${URL}&pullRequest=${prNumber}`
    }

    console.log("URL buildSonarcloudUrl: ", URL)

    return URL
}

export function buildTriggerApiUrl(): string {
    const {owner, repo, sha, prNumber} = getGitHubContext()
    let URL = `${PIXEE_URL}/${owner}/${repo}/${prNumber}`

    if (prNumber){
        URL = `${URL}`
    }

    console.log('URL buildTriggerApiUrl: ', URL)

    return URL
}

export function buildUploadApiUrl(tool: string): string {
    const {owner, repo, sha} = getGitHubContext()
    console.log('owner: ', owner)
    console.log('repo: ', repo)
    console.log('sha: ', sha)
    return `${PIXEE_URL}/${owner}/${repo}/${sha}/${tool}`
}

export function isGitHubEventValid(): boolean {
    const eventName = github.context.eventName as GitHubEvent
    console.log("eventName: ", eventName)
    return VALID_EVENTS.includes(eventName);
}

export function getGitHubContext(): GitHubContext {
    console.log('github.context: ', github.context)
    const { issue: {owner, repo}, eventName } = github.context;
    const handler = eventHandlers[eventName];

    return { owner, repo, ...handler(github.context) };
}

function getPullRequestContext(context: Context): Pick<GitHubContext, 'prNumber' | 'sha'> {
    const number = context.issue.number;
    const sha = context.payload.pull_request?.head.sha;
    return { prNumber: number, sha };
}

function getPushContext(context: Context): Pick<GitHubContext, 'prNumber' | 'sha'> {
    const sha = context.sha;
    const number = context.runNumber;

    console.log('number: ', number)
    return { prNumber: number, sha };
}

function getCheckRunContext(context: Context): Pick<GitHubContext, 'prNumber' | 'sha'> {
    const actionEvent = context.payload.check_run

    const number = actionEvent.pull_requests[0].number;
    const sha = actionEvent.head_sha;
    return { prNumber: number, sha };
}

export function wrapError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
}

export function buildError(unwrappedError: unknown) {
    const error = wrapError(unwrappedError);
    const message = error.message;
    core.setOutput("status", "error");
    core.setFailed(message);
    return;
}

export class UserError extends Error {
    constructor(message: string) {
        super(message);
    }
}

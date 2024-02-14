import * as core from "@actions/core";
import {buildError, getGithubContext, wrapError} from "./util";
import * as analysis from "./analysis-input-resource";
import * as github from '@actions/github';

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {number} = getGithubContext();
        const prNumber = core.getInput('pr-number')

        if (number || prNumber) {
            analysis.triggerPrAnalysis(core.getInput('url'), number ?? prNumber);
            core.setOutput("status", "success");
            return
        }
        core.setFailed("PR number not found. Please provide a valid PR number.");
    } catch (error) {
        buildError(error)
    }
}

async function getPullRequestNumber(): Promise<number | undefined> {
    const prNumber = github.context.payload.pull_request?.number;
    console.log(prNumber)
    return prNumber;
}

async function runWrapper() {
    try {
        await run();
    } catch (error) {
        core.setFailed(
            `Action failed: ${wrapError(error).message}`,
        );
    }
}

void runWrapper();

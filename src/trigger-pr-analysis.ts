import * as core from "@actions/core";
import {buildError, getGithubContext, wrapError} from "./util";
import * as analysis from "./analysis-input-resource";
import * as github from '@actions/github';

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {number} = getGithubContext();
        getPullRequestNumber();
        const prNumber = core.getInput('pr-number')

        if (number || prNumber || getPullRequestNumber()) {
            analysis.triggerPrAnalysis(core.getInput('url'), 4);
            core.setOutput("status", "success");
            return
        }
        core.setFailed("PR number not found. Please provide a valid PR number.");
    } catch (error) {
        buildError(error)
    }
}

 function getPullRequestNumber() {
    const payload = github.context.payload;
    const context = github.context;
    const prNumber = github.context.payload.check_run.pull_requests[0].number;
    console.log("payload: " , payload)
    console.log("context: " , context)
    console.log("context: " , prNumber)

     return prNumber
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

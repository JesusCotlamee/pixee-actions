import * as core from "@actions/core";
import {buildError, getGithubContext, wrapError} from "./util";
import * as trigger from "./trigger";
import * as github from '@actions/github';

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {number} = getGithubContext();
        const  prNumber = core.getInput('pr-number')

        console.log('github.context: ', github.context)
        console.log('getGithubContext number: ', number)
        console.log('core prNumber: ', prNumber)

        if (number || prNumber){
            trigger.triggerFromActions(core.getInput('url'), number ?? prNumber);
            core.setOutput("status", "success");
        }
        core.setFailed("PR number not found. Please provide a valid PR number.");
    } catch (error) {
        buildError(error)
    }
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

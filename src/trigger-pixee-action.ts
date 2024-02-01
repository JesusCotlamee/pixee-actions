import * as core from "@actions/core";
import {buildError, wrapError} from "./util";
import * as trigger from "./trigger";
import * as github from '@actions/github';

const EVENT_ACTION = 'opened'
const EVENT_NAME = 'pull_request'

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {eventName, payload: {action}} = github.context

        if (eventName === EVENT_NAME && action === EVENT_ACTION) {
            trigger.triggerFromActions(core.getInput('url'));

            core.setOutput("status", "success");
        } else {
            console.log('Invalid event to execute trigger.')
        }
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

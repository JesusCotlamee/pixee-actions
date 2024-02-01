import * as core from "@actions/core";
import {buildError, wrapError} from "./util";
import * as trigger from "./trigger";
import * as github from '@actions/github';
import {getRequiredInput} from "./input-helper";

const EVENT_ACTION_OPENED = 'opened'
const EVENT_PULL_REQUEST = 'pull_request';
const EVENT_WORKFLOW_DISPATCH = 'workflow_dispatch';

const eventHandlers = {
    [EVENT_PULL_REQUEST]: (action: string) => handlePullRequestEvent(action),
    [EVENT_WORKFLOW_DISPATCH]: handleWorkflowDispatchEvent
};

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {eventName, payload: {action}} = github.context
        const handler = eventHandlers[eventName];

        handler ? handler(action) : core.warning(`Invalid action for ${eventName} event.`);
        core.setOutput("status", "success");
    } catch (error) {
        buildError(error)
    }
}

function handlePullRequestEvent(action: string) {
    if (action === EVENT_ACTION_OPENED) {
        trigger.triggerFromActions(core.getInput('url'), null);
    } else {
        core.warning(`Invalid action ${action} for pull request event.`)
    }
}

function handleWorkflowDispatchEvent() {
    const prNumber = parseInt(getRequiredInput('pr-number'));
    trigger.triggerFromActions(core.getInput('url'), prNumber);
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

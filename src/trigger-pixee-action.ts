import * as core from "@actions/core";
import {buildError, wrapError} from "./util";
import * as trigger from "./trigger";
import * as github from '@actions/github';
import {getRequiredInput} from "./input-helper";

const EVENT_ACTION_OPENED = 'opened'
const EVENT_PULL_REQUEST = 'pull_request';
const EVENT_WORKFLOW_DISPATCH = 'workflow_dispatch';

const eventHandlers = {
    [`${EVENT_PULL_REQUEST}_${EVENT_ACTION_OPENED}`]: () => trigger.triggerFromActions(core.getInput('url'), null),
    [EVENT_WORKFLOW_DISPATCH]: () => trigger.triggerFromActions(core.getInput('url'), parseInt(getRequiredInput('pr-number')))
};

async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const {eventName, payload: {action}} = github.context
        console.log("github.context: ", github.context)

        const handler = eventHandlers[`${eventName}_${action}`];
        if (handler) {
            handler();
        } else {
            console.log('Invalid event to execute trigger.');
        }

        core.setOutput("status", "success");
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

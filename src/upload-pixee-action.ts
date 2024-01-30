import * as core from "@actions/core";
import {wrapError} from "./util";
import {getActionsLogger} from "./logging";
import * as upload_lib from "./upload-file";
import {getInputs} from "./input-helper";


async function run() {
    const startedAt = (new Date()).toTimeString();
    const logger = getActionsLogger();
    core.setOutput("start-at", startedAt);

    try {
        const inputs = getInputs()

        await upload_lib.uploadFromActions(
            inputs,
            logger,
            {considerInvalidRequestUserError: true},
        );

        core.setOutput("status", "success");
    } catch (unwrappedError) {
        const error = wrapError(unwrappedError);
        const message = error.message;
        core.setFailed(message);
        console.log(error);
        return;
    }
}

async function runWrapper() {
    try {
        await run();
    } catch (error) {
        core.setFailed(
            `upload-file action failed: ${wrapError(error).message}`,
        );
    }
}

void runWrapper();

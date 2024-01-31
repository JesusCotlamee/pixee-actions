import * as core from "@actions/core";
import {wrapError} from "./util";
import * as upload_lib from "./upload-file";
import {getInputs} from "./input-helper";


async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const inputs = getInputs()

        await upload_lib.uploadFromActions(
            inputs
        );

        core.setOutput("status", "success");
    } catch (unwrappedError) {
        const error = wrapError(unwrappedError);
        const message = error.message;
        core.setFailed(message);
        return;
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

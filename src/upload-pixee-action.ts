import * as core from "@actions/core";
import {buildError, wrapError} from "./util";
import * as upload from "./upload-file";
import {getInputs} from "./input-helper";


async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);

    try {
        const inputs = getInputs()
        upload.uploadFromActions(inputs);

        core.setOutput("status", "success");
    } catch (error) {
        buildError(error)
    }
}

async function runWrapper() {
    try {
        await run();
    } catch (error) {
        core.setFailed(`Action failed: ${wrapError(error).message}`);
    }
}

void runWrapper();

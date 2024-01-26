import * as core from "@actions/core";
import * as github from '@actions/github';
import {wrapError} from "./util";
import * as actionsUtil from "./actions-util";
import {getActionsLogger} from "./logging";
import * as upload_lib from "./upload-file";


async function run() {
    const startedAt = (new Date()).toTimeString();
    const logger = getActionsLogger();
    core.setOutput("start-at", startedAt);
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    // console.log(`The event payload: ${payload}`);

    try {
        const file = actionsUtil.getRequiredInput("file");
        const url = actionsUtil.getRequiredInput("url");
        console.log(`File name: ${file}, pixee url: ${url}`);

        const uploadResult = await upload_lib.uploadFromActions(
            file,
            url,
            actionsUtil.getRequiredInput("checkout_path"),
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

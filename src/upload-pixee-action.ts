import * as core from "@actions/core";
import {wrapError} from "./util";
import * as actionsUtil from "./actions-util";
import {getActionsLogger} from "./logging";
import * as upload_lib from "./upload-file";


async function run() {
    const startedAt = (new Date()).toTimeString();
    const logger = getActionsLogger();
    core.setOutput("start-at", startedAt);

    try {
        const file = actionsUtil.getRequiredInput("file");
        const url = actionsUtil.getRequiredInput("url");

        await upload_lib.uploadFromActions(
            file,
            url,
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

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const util_1 = require("./util");
const trigger = __importStar(require("./trigger"));
const github = __importStar(require("@actions/github"));
const input_helper_1 = require("./input-helper");
const EVENT_ACTION_OPENED = 'opened';
const EVENT_PULL_REQUEST = 'pull_request';
const EVENT_WORKFLOW_DISPATCH = 'workflow_dispatch';
const eventHandlers = {
    [EVENT_PULL_REQUEST]: (action) => handlePullRequestEvent(action),
    [EVENT_WORKFLOW_DISPATCH]: handleWorkflowDispatchEvent
};
async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);
    try {
        const { eventName, payload: { action } } = github.context;
        console.log('github.context: ', github.context);
        const handler = eventHandlers[eventName];
        handler ? handler(action) : core.warning(`Invalid action for ${eventName} event.`);
        core.setOutput("status", "success");
    }
    catch (error) {
        (0, util_1.buildError)(error);
    }
}
function handlePullRequestEvent(action) {
    if (action === EVENT_ACTION_OPENED) {
        trigger.triggerFromActions(core.getInput('url'), null);
    }
    else {
        core.warning(`Invalid action ${action} for pull request event.`);
    }
}
function handleWorkflowDispatchEvent() {
    const prNumber = parseInt((0, input_helper_1.getRequiredInput)('pr-number'));
    trigger.triggerFromActions(core.getInput('url'), prNumber);
}
async function runWrapper() {
    try {
        await run();
    }
    catch (error) {
        core.setFailed(`Action failed: ${(0, util_1.wrapError)(error).message}`);
    }
}
void runWrapper();
//# sourceMappingURL=trigger-pixee-action.js.map
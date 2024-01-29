"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true, get: function () {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", {value: true});
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const util_1 = require("./util");
const actionsUtil = __importStar(require("./actions-util"));
const logging_1 = require("./logging");
const upload_lib = __importStar(require("./upload-file"));

async function run() {
    const startedAt = (new Date()).toTimeString();
    const logger = (0, logging_1.getActionsLogger)();
    core.setOutput("start-at", startedAt);
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
    try {
        const file = actionsUtil.getRequiredInput("file");
        const url = actionsUtil.getRequiredInput("url");
        await upload_lib.uploadFromActions(file, url, logger, {considerInvalidRequestUserError: true});
        core.setOutput("status", "success");
    } catch (unwrappedError) {
        const error = (0, util_1.wrapError)(unwrappedError);
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
        core.setFailed(`upload-file action failed: ${(0, util_1.wrapError)(error).message}`);
    }
}

void runWrapper();
//# sourceMappingURL=upload-pixee-action.js.map

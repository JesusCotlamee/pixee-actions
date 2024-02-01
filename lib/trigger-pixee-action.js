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
async function run() {
    const startedAt = (new Date()).toTimeString();
    core.setOutput("start-at", startedAt);
    try {
        const { number } = (0, util_1.getGithubContext)();
        const prNumber = core.getInput('pr-number');
        console.log('github.context: ', github.context);
        console.log('getGithubContext: ', (0, util_1.getGithubContext)().number);
        console.log('prNumber: ', prNumber);
        if (number == null && prNumber == null) {
            core.setFailed("PR number not found. Please provide a valid PR number.");
        }
        trigger.triggerFromActions(core.getInput('url'), parseInt(prNumber));
        core.setOutput("status", "success");
    }
    catch (error) {
        (0, util_1.buildError)(error);
    }
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
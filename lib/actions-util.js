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
exports.getCommitOid = exports.getActionVersion = exports.getRequiredInput = void 0;
const core = __importStar(require("@actions/core"));
const toolrunner = __importStar(require("@actions/exec/lib/toolrunner"));
const safeWhich = __importStar(require("@chrisgavin/safe-which"));
const util_1 = require("./util");
const pkg = require("../package.json");
const getRequiredInput = function (name) {
    const value = core.getInput(name);
    if (!value) {
        throw new util_1.UserError(`Input required and not supplied: ${name}`);
    }
    return value;
};
exports.getRequiredInput = getRequiredInput;
function getActionVersion() {
    return pkg.version;
}
exports.getActionVersion = getActionVersion;
const getCommitOid = async function (checkoutPath, ref = "HEAD") {
    let stderr = "";
    try {
        let commitOid = "";
        await new toolrunner.ToolRunner(await safeWhich.safeWhich("git"), ["rev-parse", ref], {
            silent: true,
            listeners: {
                stdout: (data) => {
                    commitOid += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                },
            },
            cwd: checkoutPath,
        }).exec();
        return commitOid.trim();
    }
    catch (e) {
        if (stderr.includes("not a git repository")) {
            core.info("Could not determine current commit SHA using git.");
        }
        else {
            core.info(`Could not determine current commit SHA using git. Continuing with data from user input or environment. ${stderr}`);
        }
        return (0, util_1.getRequiredEnvParam)("GITHUB_SHA");
    }
};
exports.getCommitOid = getCommitOid;
//# sourceMappingURL=actions-util.js.map
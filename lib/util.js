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
exports.UserError = exports.buildError = exports.wrapError = exports.parseRepository = exports.getRequiredEnvParam = exports.buildApiUrl = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const PIXEE_SAMBOX_URL = 'https://d22balbl18.execute-api.us-east-1.amazonaws.com/prod';
function buildApiUrl(inputs) {
    const { url, tool } = inputs;
    const { sha, } = github.context;
    console.log("context: ", github.context);
    console.log("context payload repository: ", github.context.payload.repository);
    console.log("context payload repository: ", github.context.payload.repository?.owner);
    console.log("context repo: ", github.context.repo);
    const { owner, repo } = github.context.repo;
    const customUrl = url ? url : PIXEE_SAMBOX_URL;
    return `${customUrl}/analysis-input/${owner}/${repo}/${sha}/${tool}`;
}
exports.buildApiUrl = buildApiUrl;
function getRequiredEnvParam(paramName) {
    const value = process.env[paramName];
    if (value === undefined || value.length === 0) {
        throw new Error(`${paramName} environment variable must be set`);
    }
    return value;
}
exports.getRequiredEnvParam = getRequiredEnvParam;
function parseRepository(input) {
    const parts = input.split("/");
    if (parts.length !== 2) {
        throw new UserError(`"${input}" is not a valid repository name`);
    }
    return {
        owner: parts[0],
        repo: parts[1],
    };
}
exports.parseRepository = parseRepository;
function wrapError(error) {
    return error instanceof Error ? error : new Error(String(error));
}
exports.wrapError = wrapError;
function buildError(unwrappedError) {
    const error = wrapError(unwrappedError);
    const message = error.message;
    core.setFailed(message);
    return;
}
exports.buildError = buildError;
class UserError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UserError = UserError;
//# sourceMappingURL=util.js.map
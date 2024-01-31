"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserError = exports.wrapError = exports.parseRepository = exports.getRequiredEnvParam = exports.buildApiUrl = void 0;
function buildApiUrl(inputs) {
    const sha = getRequiredEnvParam("GITHUB_SHA");
    const { owner, repo } = parseRepository(getRequiredEnvParam("GITHUB_REPOSITORY"));
    return `${inputs.url}/analysis-input/${owner}/${repo}/${sha}/${inputs.tool}`;
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
class UserError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.UserError = UserError;
//# sourceMappingURL=util.js.map
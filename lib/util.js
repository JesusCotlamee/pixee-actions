"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRepository = exports.getRequiredEnvParam = exports.UserError = exports.wrapError = exports.buildApiUrl = exports.AUDIENCE = void 0;
exports.AUDIENCE = 'https://app.pixee.ai';
function buildApiUrl(inputs) {
    const sha = getRequiredEnvParam("GITHUB_SHA");
    const { owner, repo } = parseRepository(getRequiredEnvParam("GITHUB_REPOSITORY"));
    return `${inputs.url}/analysis-input/${owner}/${repo}/${sha}/${inputs.tool}`;
}
exports.buildApiUrl = buildApiUrl;
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
//# sourceMappingURL=util.js.map
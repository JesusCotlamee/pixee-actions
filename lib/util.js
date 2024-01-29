"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredEnvParam = exports.UserError = exports.wrapError = exports.buildApiUrl = exports.AUDIENCE = void 0;
const repository_1 = require("./repository");
exports.AUDIENCE = 'https://app.pixee.ai';
function buildApiUrl(api) {
    const sha = getRequiredEnvParam("GITHUB_SHA");
    const { owner, repo } = (0, repository_1.parseRepository)(getRequiredEnvParam("GITHUB_REPOSITORY"));
    return `${api}/analysis-input/${owner}/${repo}/${sha}/sonar}`;
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
//# sourceMappingURL=util.js.map
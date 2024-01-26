"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequiredEnvParam = exports.UserError = exports.wrapError = void 0;
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
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
exports.getApiClient = void 0;
const githubUtils = __importStar(require("@actions/github/lib/utils"));
const core = __importStar(require("@actions/core"));
const actions_util_1 = require("./actions-util");
const util_1 = require("./util");
const retry = __importStar(require("@octokit/plugin-retry"));
function createApiClientWithDetails(baseUrl, apiDetails) {
    const auth = apiDetails.Authorization;
    const retryingOctokit = githubUtils.GitHub.plugin(retry.retry);
    return new retryingOctokit(githubUtils.getOctokitOptions(auth, { baseUrl, userAgent: `Action/${(0, actions_util_1.getActionVersion)()}` }));
}
async function getApiDetails() {
    const audience = 'https://app.pixee.ai';
    const token = await core.getIDToken(audience);
    return {
        Authorization: `Bearer ${token}`,
        url: (0, util_1.getRequiredEnvParam)("GITHUB_SERVER_URL"),
        apiURL: (0, util_1.getRequiredEnvParam)("GITHUB_API_URL"), // check host
    };
}
async function getApiClient(baseUrl) {
    return createApiClientWithDetails(baseUrl, await getApiDetails());
}
exports.getApiClient = getApiClient;
//# sourceMappingURL=api-client.js.map
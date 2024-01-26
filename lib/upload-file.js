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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFromActions = void 0;
const repository_1 = require("./repository");
const util = __importStar(require("./util"));
const util_1 = require("./util");
const zlib_1 = __importDefault(require("zlib"));
const api = __importStar(require("./api-client"));
const actionsUtil = __importStar(require("./actions-util"));
async function uploadFromActions(file, baseUrl, checkoutPath, logger, { considerInvalidRequestUserError, }) {
    try {
        return await uploadFile(file, baseUrl, (0, repository_1.parseRepository)(util.getRequiredEnvParam("GITHUB_REPOSITORY")), await actionsUtil.getCommitOid(checkoutPath), logger);
    }
    catch (e) {
        if (e instanceof InvalidRequestError && considerInvalidRequestUserError) {
            throw new util_1.UserError(e.message);
        }
        throw e;
    }
}
exports.uploadFromActions = uploadFromActions;
async function uploadFile(file, baseUrl, repository, commitOid, logger) {
    logger.startGroup("Uploading results");
    logger.info(`Processing pixee files: ${JSON.stringify(file)}`);
    const fileJson = JSON.stringify(file);
    const fileGzip = zlib_1.default.gzipSync(fileJson).toString("base64");
    const rawUploadSizeBytes = fileJson.length;
    logger.info(`Upload size: ${rawUploadSizeBytes} bytes`);
    await uploadPayload(fileGzip, repository, commitOid, baseUrl, logger);
    logger.endGroup();
    return {
        statusReport: {
            raw_upload_size_bytes: rawUploadSizeBytes
        }
    };
}
async function uploadPayload(file, repository, commitOid, baseUrl, logger) {
    logger.info("Uploading results api client");
    const client = await api.getApiClient(baseUrl);
    const response = await client.request("PUT /:owner/:repo/:sha/:tool", {
        owner: repository.owner,
        repo: repository.repo,
        sha: commitOid,
        tool: 'sonar',
        file,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    logger.debug(`response status: ${response.status}`);
    logger.info("Successfully uploaded results");
    return response.data.id;
}
class InvalidRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
//# sourceMappingURL=upload-file.js.map
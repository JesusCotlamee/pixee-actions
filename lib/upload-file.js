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
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const core = __importStar(require("@actions/core"));
async function uploadFromActions(file, url, logger, { considerInvalidRequestUserError, }) {
    try {
        await uploadFile(file, url, (0, repository_1.parseRepository)(util.getRequiredEnvParam("GITHUB_REPOSITORY")), core.getInput('sha'), logger);
    }
    catch (e) {
        if (e instanceof InvalidRequestError && considerInvalidRequestUserError) {
            throw new util_1.UserError(e.message);
        }
        throw e;
    }
}
exports.uploadFromActions = uploadFromActions;
async function uploadFile(file, baseUrl, repository, sha, logger) {
    logger.startGroup("Uploading results");
    logger.info(`Processing pixee files: ${JSON.stringify(file)}`);
    /*    const fileJson = JSON.stringify(file);
        const fileGzip = zlib.gzipSync(fileJson).toString("base64");
        const rawUploadSizeBytes = fileJson.length;
        logger.info(`Upload size: ${rawUploadSizeBytes} bytes`);*/
    await uploadPayload(file, repository, sha, baseUrl, logger);
    logger.endGroup();
}
async function uploadPayload(filePath, repository, sha, baseUrl, logger) {
    logger.info("Uploading results api client");
    const { owner, repo } = repository;
    const customUrl = `${baseUrl}/${owner}/${repo}/${sha}/sonar`;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const form = new form_data_1.default();
    form.append('file', fileContent, { filename: 'filePath' });
    const audience = 'https://app.pixee.ai';
    const idToken = core.getIDToken(audience);
    return new Promise((resolve, reject) => {
        try {
            axios_1.default.put(customUrl, form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${core.getInput('token')}`,
                },
            })
                .then(response => {
                resolve(response.data);
            })
                .catch(error => {
                reject(error);
            });
        }
        catch (error) {
            reject(new Error(`Error al leer el archivo: ${error}`));
        }
    });
}
class InvalidRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
//# sourceMappingURL=upload-file.js.map
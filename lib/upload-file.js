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
const util_1 = require("./util");
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const core = __importStar(require("@actions/core"));
const AUDIENCE = 'https://app.pixee.ai';
const UTF = 'utf-8';
async function uploadFromActions(inputs, logger) {
    try {
        await uploadPayload(inputs, logger);
    }
    catch (e) {
        if (e instanceof util_1.UserError) {
            throw new util_1.UserError(e.message);
        }
        throw e;
    }
}
exports.uploadFromActions = uploadFromActions;
async function uploadPayload(inputs, logger) {
    logger.info("Uploading results api client");
    const fileContent = fs.readFileSync(inputs.file, UTF);
    const form = new form_data_1.default();
    form.append('file', fileContent);
    const tokenPromise = core.getIDToken(AUDIENCE);
    tokenPromise.then(token => {
        try {
            axios_1.default.put((0, util_1.buildApiUrl)(inputs), form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                if (response.status == 204) {
                    logger.info(`Response status: ${response.status}`);
                    console.log(`Response status console: ${response.status}`);
                    throw new util_1.UserError(`Response status: ${response.status}`);
                }
            })
                .catch(error => {
                console.log("Test error");
                logger.error('Error logger');
                new util_1.UserError(`Response status: ${error}`);
            });
        }
        catch (error) {
            new util_1.UserError(`Response status: ${error}`);
        }
    }).catch(error => {
        new util_1.UserError(`Response status: ${error}`);
    });
}
//# sourceMappingURL=upload-file.js.map
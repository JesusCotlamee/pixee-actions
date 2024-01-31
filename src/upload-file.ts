import {Logger} from "./logging";
import {buildApiUrl, UserError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";
import {UploadInputs} from "./upload-inputs";

const AUDIENCE = 'https://app.pixee.ai'
const UTF = 'utf-8'

export async function uploadFromActions(
    inputs: UploadInputs,
    logger: Logger
) {
    try {
        await uploadPayload(
            inputs,
            logger);
    } catch (e) {
        if (e instanceof UserError) {
            throw new UserError(e.message);
        }
        throw e;
    }
}

async function uploadPayload(
    inputs: UploadInputs,
    logger: Logger,
) {
    logger.info("Uploading results api client");

    const fileContent = fs.readFileSync(inputs.file, UTF);
    const form = new FormData();
    form.append('file', fileContent);

    const tokenPromise = core.getIDToken(AUDIENCE)

    tokenPromise.then(token => {
        new Promise((resolve, reject) => {
            try {
                axios.put(buildApiUrl(inputs), form, {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        logger.info(`Response status: ${response.status}`)
                        console.log(`Response status: ${response.status}`)
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                reject(new UserError(`Error file: ${error}`));
            }
        });
    })
}

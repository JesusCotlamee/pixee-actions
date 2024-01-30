import {Logger} from "./logging";
import {AUDIENCE, buildApiUrl, UserError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";
import {UploadInputs} from "./upload-inputs";

export async function uploadFromActions(
    inputs: UploadInputs,
    logger: Logger,
    {
        considerInvalidRequestUserError,
    }: { considerInvalidRequestUserError: boolean },
) {
    try {
        await uploadPayload(
            inputs,
            logger);
    } catch (e) {
        if (e instanceof InvalidRequestError && considerInvalidRequestUserError) {
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

    const fileContent = fs.readFileSync(inputs.file, 'utf-8');
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
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject(error);
                    });
            } catch (error) {
                reject(new Error(`Error file: ${error}`));
            }
        });
    })
}


class InvalidRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

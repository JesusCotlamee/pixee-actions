import {Logger} from "./logging";
import {buildApiUrl, UserError, wrapError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";
import {UploadInputs} from "./upload-inputs";
import {error} from "@actions/core";

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
            try {
                axios.put(buildApiUrl(inputs), form, {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        if (response.status == 204){
                            logger.info(`Response status: ${response.status}`)
                            console.log(`Response status console: ${response.status}`)

                            throw new UserError(`Response status: ${response.status}`)
                        }
                    })
                    .catch(error => {
                        console.log("Test error")
                        throw wrapError(error)
                    });
            } catch (error) {
                wrapError(error)
            }
        }

            ).catch(error => {
        wrapError(error)
    })
}

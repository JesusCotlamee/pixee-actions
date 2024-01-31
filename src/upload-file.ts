import {Logger} from "./logging";
import {buildApiUrl, UserError, wrapError} from "./util";
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
         uploadPayload(
            inputs,
            logger);
    } catch (e) {
        if (e instanceof UserError) {
            logger.error('Error logger 4')
            throw new UserError(e.message);
        }
        logger.error('Error logger 5')
        throw e;
    }
}

 function uploadPayload(
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
                        if (response.status == 204) {
                            logger.info(`Response status: ${response.status}`)
                            core.error(`Response status core: ${response.status}`)
                            console.log(`Response status console: ${response.status}`)


                            core.setFailed(`Response status : ${response.status}`);
                        return
                        }
                    })
                    .catch(error => {

                        if (error instanceof UserError) {
                            console.log("Test error")
                            logger.error('Error logger 1')
                            throw new UserError(error.message);
                        }
                        logger.error('Error logger 1.1')
                        throw error;


                    });
            } catch (error) {
                logger.error('Error logger 2')
                throw new UserError(`Response status: ${error}`)
            }
        }
    ).catch(error => {
        logger.error('Error logger 3')
        throw  new UserError(`Response status: ${error}`)
    })
}

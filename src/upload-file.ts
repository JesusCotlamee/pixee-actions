import {buildApiUrl, buildError, UserError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";
import {UploadInputs} from "./upload-inputs";

const AUDIENCE = 'https://app.pixee.ai'
const UTF = 'utf-8'

export async function uploadFromActions(
    inputs: UploadInputs
) {
    try {
        uploadPayload(inputs);
    } catch (e) {
        if (e instanceof UserError) {
            core.error('Error logger 4')
            throw new UserError(e.message);
        }
        core.error('Error logger 5')
        throw e;
    }
}

function uploadPayload(
    inputs: UploadInputs
) {
    core.info("Uploading results api client");

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
                            core.setFailed(`Failed response status: ${response.status}`);
                            return
                        }
                    })
                    .catch(error => buildError(error));
            } catch (error) {
                buildError(error);
            }
        }
    )
}

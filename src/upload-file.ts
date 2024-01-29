import {Logger} from "./logging";
import {AUDIENCE, buildApiUrl, UserError} from "./util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";

export async function uploadFromActions(
    file: string,
    url: string,
    logger: Logger,
    {
        considerInvalidRequestUserError,
    }: { considerInvalidRequestUserError: boolean },
) {
    try {
        await uploadPayload(
            file,
            url,
            core.getInput('sha'),
            logger);
    } catch (e) {
        if (e instanceof InvalidRequestError && considerInvalidRequestUserError) {
            throw new UserError(e.message);
        }
        throw e;
    }
}

async function uploadPayload(
    filePath: string,
    url: string,
    sha: string,
    logger: Logger,
) {
    logger.info("Uploading results api client");

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const form = new FormData();
    form.append('file', fileContent);
    console.log("AUDIENCE", AUDIENCE)
    const tokenPromise = core.getIDToken(AUDIENCE)

    const api = buildApiUrl(url, sha);
    console.log(api)

    tokenPromise.then(token => {
        new Promise((resolve, reject) => {
            try {
                axios.put(api, form, {
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
                reject(new Error(`Error al leer el archivo: ${error}`));
            }
        });
    })
}


class InvalidRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

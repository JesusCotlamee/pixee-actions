import {Logger} from "./logging";
import {parseRepository, Repository} from "./repository";
import * as util from "./util";
import {UserError} from "./util";
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
            parseRepository(util.getRequiredEnvParam("GITHUB_REPOSITORY")),
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
    repository: Repository,
    logger: Logger,
) {
    logger.info("Uploading results api client");
    const {owner, repo} = repository
    const customUrl = `${url}/${owner}/${repo}/${sha}/sonar`

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const form = new FormData();
    form.append('file', fileContent);

    const audience = 'https://app.pixee.ai'
    const tokenPromise = core.getIDToken(audience)

    tokenPromise.then(token => {
        new Promise((resolve, reject) => {
            try {
                axios.put(customUrl, form, {
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

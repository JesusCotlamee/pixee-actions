import {Logger} from "./logging";
import {parseRepository, Repository} from "./repository";
import * as util from "./util";
import {UserError} from "./util";
import * as actionsUtil from "./actions-util";
import * as fs from 'fs';
import axios from "axios";
import FormData from 'form-data';
import * as core from "@actions/core";

export async function uploadFromActions(
    file: string,
    baseUrl: string,
    checkoutPath: string,
    logger: Logger,
    {
        considerInvalidRequestUserError,
    }: { considerInvalidRequestUserError: boolean },
) {
    try {
        await uploadFile(
            file,
            baseUrl,
            parseRepository(util.getRequiredEnvParam("GITHUB_REPOSITORY")),
            core.getInput('sha'),
            logger,
        );
    } catch (e) {
        if (e instanceof InvalidRequestError && considerInvalidRequestUserError) {
            throw new UserError(e.message);
        }
        throw e;
    }
}

async function uploadFile(
    file: string,
    baseUrl: string,
    repository: Repository,
    sha: string,
    logger: Logger,
) {
    logger.startGroup("Uploading results");
    logger.info(`Processing pixee files: ${JSON.stringify(file)}`);



    /*    const fileJson = JSON.stringify(file);
        const fileGzip = zlib.gzipSync(fileJson).toString("base64");
        const rawUploadSizeBytes = fileJson.length;
        logger.info(`Upload size: ${rawUploadSizeBytes} bytes`);*/


    await uploadPayload(file, repository, sha, baseUrl, logger);
    logger.endGroup();
}

async function uploadPayload(
    filePath: string,
    repository: Repository,
    sha: string,
    baseUrl: string,
    logger: Logger,
) {
    logger.info("Uploading results api client");
    const {owner, repo} = repository
    const customUrl = `${baseUrl}/${owner}/${repo}/${sha}/sonar`

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const form = new FormData();
    form.append('file', fileContent, { filename: 'filePath' });


    const audience = 'https://app.pixee.ai'
    const idToken = core.getIDToken(audience)

    return new Promise((resolve, reject) => {
        try {
            axios.put(customUrl, form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${idToken}`,
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

}


class InvalidRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

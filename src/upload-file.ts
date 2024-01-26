import {Logger} from "./logging";
import {parseRepository, Repository} from "./repository";
import * as util from "./util";
import {UserError} from "./util";
import * as api from "./api-client";
import * as actionsUtil from "./actions-util";
import * as fs from 'fs';
import axios from "axios";

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
            await actionsUtil.getCommitOid(checkoutPath),
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
    commitOid: string,
    logger: Logger,
) {
    logger.startGroup("Uploading results");
    logger.info(`Processing pixee files: ${JSON.stringify(file)}`);

    const fileContent = fs.readFileSync(file, 'utf-8');
    const jsonData = JSON.parse(fileContent);


    /*    const fileJson = JSON.stringify(file);
        const fileGzip = zlib.gzipSync(fileJson).toString("base64");
        const rawUploadSizeBytes = fileJson.length;
        logger.info(`Upload size: ${rawUploadSizeBytes} bytes`);*/


    await uploadPayload(jsonData, repository, commitOid, baseUrl, logger);
    logger.endGroup();
}

async function uploadPayload(
    jsonData: string,
    repository: Repository,
    commitOid: string,
    baseUrl: string,
    logger: Logger,
) {
    logger.info("Uploading results api client");
    const {owner, repo} = repository
    const customUrl = `${baseUrl}/${owner}/${repo}/${commitOid}/sonar`

    return new Promise((resolve, reject) => {
        try {
            axios.post(customUrl, jsonData, {
                headers: api.getHeaders(),
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

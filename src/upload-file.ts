import {Logger} from "./logging";
import {parseRepository, Repository} from "./repository";
import * as util from "./util";
import {UserError} from "./util";
import * as api from "./api-client";
import * as actionsUtil from "./actions-util";
import * as fs from 'fs';

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

    const fileContent = fs.readFileSync(file);
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fileContent, { filename: 'archivo.txt' });

/*    const fileJson = JSON.stringify(file);
    const fileGzip = zlib.gzipSync(fileJson).toString("base64");
    const rawUploadSizeBytes = fileJson.length;
    logger.info(`Upload size: ${rawUploadSizeBytes} bytes`);*/


    await uploadPayload(form, repository, commitOid, baseUrl, logger);
    logger.endGroup();
}

async function uploadPayload(
    file: string,
    repository: Repository,
    commitOid: string,
    baseUrl: string,
    logger: Logger,
) {
    logger.info("Uploading results api client");
    const client = await api.getApiClient(baseUrl);

    const response = await client.request(
        "PUT /:owner/:repo/:sha/:tool",
        {
            owner: repository.owner,
            repo: repository.repo,
            sha: commitOid,
            tool: 'sonar',
            file,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        },
    );

    logger.debug(`response status: ${response.status}`);
    logger.info("Successfully uploaded results");

    return response.data.id;
}

class InvalidRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

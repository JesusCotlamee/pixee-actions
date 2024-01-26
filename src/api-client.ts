import * as githubUtils from "@actions/github/lib/utils";
import * as core from "@actions/core";
import {getActionVersion} from "./actions-util";
import {getRequiredEnvParam} from "./util";
import * as retry from "@octokit/plugin-retry";

export interface GitHubApiDetails {
    Authorization: string;
    url: string;
    apiURL: string | undefined;
}

function createApiClientWithDetails(
    baseUrl: string,
    apiDetails: GitHubApiDetails
) {
    const auth = apiDetails.Authorization;
    const retryingOctokit = githubUtils.GitHub.plugin(retry.retry);
    return new retryingOctokit(
        githubUtils.getOctokitOptions(auth, { baseUrl, userAgent: `Action/${getActionVersion()}`}),
    );
}

async function getApiDetails() {
    const audience = 'https://app.pixee.ai'
    const token = await core.getIDToken(audience)

    return {
        Authorization: `Bearer ${token}`,
        url: getRequiredEnvParam("GITHUB_SERVER_URL"),
        apiURL: getRequiredEnvParam("GITHUB_API_URL"), // check host
    };
}

export async function getApiClient(baseUrl: string,) {
    return createApiClientWithDetails(baseUrl, await getApiDetails());
}

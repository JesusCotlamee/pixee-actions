import * as core from "@actions/core";
import {buildError, buildSonarcloudUrl, buildTriggerApiUrl, buildUploadApiUrl} from "./util";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import {Tool} from "./input-helper";
import {SonarcloudInputs} from "./sonarcloud-inputs";

const UTF = 'utf-8'
const AUDIENCE = 'https://app.pixee.ai'
const FILE_NAME = 'sonar_issues.json';

export function downloadSonarcloudFile(inputs: SonarcloudInputs) {
    axios.get(buildSonarcloudUrl(inputs), {
        headers: {
            contentType: 'application/json',
            Authorization: `Bearer ${inputs.token}`
        },
        responseType: 'json'
    })
        .then(response => {
            fs.writeFileSync(FILE_NAME, JSON.stringify(response.data));
            uploadInputFile('sonar', FILE_NAME)
        })
        .catch(error => buildError(error));
}

export function uploadInputFile(tool: Tool, file: string) {
    const fileContent = fs.readFileSync(file, UTF);
    const form = new FormData();
    form.append('file', fileContent);

    const tokenPromise = core.getIDToken(AUDIENCE)

    tokenPromise.then(token => {
            try {
                axios.put(buildUploadApiUrl(tool), form, {
                    headers: {
                        ...form.getHeaders(),
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(response => {
                        if (response.status != 204) {
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

export function triggerPrAnalysis(prNumber: number) {
    console.log('Test triggerPrAnalysis: ', prNumber)
    const tokenPromise = core.getIDToken(AUDIENCE)

    tokenPromise.then(token => {
        try {
            axios.post(buildTriggerApiUrl(prNumber), null, {
                headers: {
                    contentType: 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.status != 204) {
                        core.setFailed(`Failed response status: ${response.status}`);
                        return
                    }
                })
                .catch(error => buildError(error));
        } catch (error) {
            buildError(error)
        }
    })
}

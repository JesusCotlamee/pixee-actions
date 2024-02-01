import * as core from '@actions/core'
import {UploadInputs} from './upload-inputs'
import {UserError} from "./util";

export type Inputs = 'file' | 'url' | 'tool' | 'pr-number'

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
    const url = core.getInput('url');
    const file = getRequiredInput('file');
    const tool = getRequiredInput('tool');

    return {file, url, tool} as UploadInputs
}

export function getRequiredInput(name: Inputs): string {
    const value = core.getInput(name);
    if (!value) {
        throw new UserError(`Input required and not supplied: ${name}`);
    }
    return value;
}

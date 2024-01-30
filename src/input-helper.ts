import * as core from '@actions/core'
import {Inputs} from './constants'
import {UploadInputs} from './upload-inputs'
import {UserError} from "./util";

/**
 * Helper to get all the inputs for the action
 */
export function getInputs(): UploadInputs {
    const file = getRequiredInput(Inputs.File);
    const url = getRequiredInput(Inputs.Url);
    const tool = getRequiredInput(Inputs.Tool);

    return {file, url, tool} as UploadInputs
}


const getRequiredInput = function (name: string): string {
    const value = core.getInput(name);
    if (!value) {
        throw new UserError(`Input required and not supplied: ${name}`);
    }
    return value;
};

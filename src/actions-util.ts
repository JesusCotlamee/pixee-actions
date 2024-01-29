import * as core from "@actions/core";
import {UserError} from "./util";

export const getRequiredInput = function (name: string): string {
    const value = core.getInput(name);
    if (!value) {
        throw new UserError(`Input required and not supplied: ${name}`);
    }
    return value;
};

import * as core from "@actions/core";

export interface Logger {
    debug: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string | Error) => void;
    error: (message: string | Error) => void;

    isDebug: () => boolean;

    startGroup: (name: string) => void;
    endGroup: () => void;
}

export function getActionsLogger(): Logger {
    return core;
}

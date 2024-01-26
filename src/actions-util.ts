import * as core from "@actions/core";
import {JSONSchemaForNPMPackageJsonFiles} from "@schemastore/package";
import * as toolrunner from "@actions/exec/lib/toolrunner";
import * as safeWhich from "@chrisgavin/safe-which";
import {getRequiredEnvParam, UserError,} from "./util";

const pkg = require("../package.json") as JSONSchemaForNPMPackageJsonFiles;

export const getRequiredInput = function (name: string): string {
    const value = core.getInput(name);
    if (!value) {
        throw new UserError(`Input required and not supplied: ${name}`);
    }
    return value;
};

export function getActionVersion(): string {
    return pkg.version!;
}

export const getCommitOid = async function (
    checkoutPath: string,
    ref = "HEAD",
): Promise<string> {
    let stderr = "";
    try {
        let commitOid = "";
        await new toolrunner.ToolRunner(
            await safeWhich.safeWhich("git"),
            ["rev-parse", ref],
            {
                silent: true,
                listeners: {
                    stdout: (data) => {
                        commitOid += data.toString();
                    },
                    stderr: (data) => {
                        stderr += data.toString();
                    },
                },
                cwd: checkoutPath,
            },
        ).exec();
        return commitOid.trim();
    } catch (e) {
        if (stderr.includes("not a git repository")) {
            core.info(
                "Could not determine current commit SHA using git.",
            );
        } else {
            core.info(
                `Could not determine current commit SHA using git. Continuing with data from user input or environment. ${stderr}`,
            );
        }

        return getRequiredEnvParam("GITHUB_SHA");
    }
};

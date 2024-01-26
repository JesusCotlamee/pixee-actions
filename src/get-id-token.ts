const core = require('@actions/core');

async function getIDTokenAction(): Promise<void> {

    const audience = core.getInput('audience', {required: false})
    const id_token1 = await core.getIDToken()
    console.log("audience: ", audience)
    console.log("id_token1: ", id_token1)
}

getIDTokenAction()

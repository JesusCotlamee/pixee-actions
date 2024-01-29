"use strict";
const core = require('@actions/core');

async function getIDTokenAction() {
    const audience = core.getInput('audience', {required: false});
    const id_token1 = await core.getIDToken();
    console.log("audience: ", audience);
    console.log("id_token1: ", id_token1);
}

getIDTokenAction();
//# sourceMappingURL=get-id-token.js.map

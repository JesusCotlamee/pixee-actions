import * as core from "@actions/core";


export function getHeaders() {
    const audience = 'https://app.pixee.ai'
    const token = core.getIDToken(audience)

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

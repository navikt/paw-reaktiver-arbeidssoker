import { Client, Issuer } from 'openid-client'

import { verifyAndGetAzureConfig } from './config'

let issuer: Issuer<Client>
export async function getIssuer(): Promise<Issuer<Client>> {
    if (issuer == null) {
        const azureConfig = verifyAndGetAzureConfig()

        issuer = await Issuer.discover(azureConfig.discoveryUrl)
    }
    return issuer
}

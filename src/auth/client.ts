import { Client, ClientMetadata } from 'openid-client'

import { verifyAndGetAzureConfig } from './config'
import { getIssuer } from './issuer'

let client: Client | null = null
async function getAuthClient(scope: string): Promise<Client> {
    if (client) return client

    const azureConfig = verifyAndGetAzureConfig()
    const metadata: ClientMetadata = {
        client_id: azureConfig.clientId,
        client_secret: azureConfig.clientSecret,
        // tenant: '', // ??
        grant_type: 'client_credentials',
        scope // api://<cluster>.<namespace>.<app-name>/.default
    }

    const issuer = await getIssuer()
    client = new issuer.Client(metadata)

    return client
}

export default getAuthClient

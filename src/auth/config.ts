import { z } from 'zod'

export interface AzureConfig {
    discoveryUrl: string
    clientId: string
    clientSecret: string
}

const RequiredAzureConfigSchema = z.object({
    clientId: z.string(),
    clientSecret: z.string(),
    discoveryUrl: z.string(),
})

export function verifyAndGetAzureConfig(): AzureConfig {
    const parsedEnv = RequiredAzureConfigSchema.safeParse({
        clientId: process.env.AZURE_APP_CLIENT_ID,
        clientSecret: process.env.AZURE_APP_CLIENT_SECRET,
        discoveryUrl: process.env.AZURE_APP_WELL_KNOWN_URL,
    })

    if (parsedEnv.success) {
        return parsedEnv.data
    }

    throw new Error(
        `Missing environment variable ${JSON.stringify(
            parsedEnv.error.errors,
            null,
            2,
        )}. Are you sure you have enabled Azure Wonderwall in your nais.yml for this environment?`,
    )
}

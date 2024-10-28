import SecretsManager from "@aws-sdk/client-secrets-manager";
import { region, prefix } from "./const.js";

const client = new SecretsManager.SecretsManagerClient({ region: region })

export async function getSecret(key) {
    const envVal = process.env[key]
    if (envVal) return envVal
    try {
        const response = await client.send(
            new SecretsManager.GetSecretValueCommand({
                SecretId: prefix
            })
        );
        const secret = JSON.parse(response.SecretString)
        return secret[key]
    } catch (error) {
        console.log(error)
        throw error
    }
}
import SecretsManager from "@aws-sdk/client-secrets-manager";
import { region, secretName } from "./const.js";

const client = new SecretsManager.SecretsManagerClient({ region: region })

export async function getSecret(key) {
    try {
        const response = await client.send(
            new SecretsManager.GetSecretValueCommand({
                SecretId: secretName
            })
        );
        const secret = JSON.parse(response.SecretString);
        return secret[key]
    } catch (error) {
        console.log(error);
        throw error
    }
}
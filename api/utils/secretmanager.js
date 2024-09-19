import SecretsManager from "@aws-sdk/client-secrets-manager";

const secretName = process.env.SECRET_MANAGER_NAME;
const client = new SecretsManager.SecretsManagerClient({ region: process.env.AWS_REGION })

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
    }
}
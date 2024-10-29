import { errBuilder, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function login(req, res) {
    const { username, password } = req.body;

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
        },
    });

    const response = await cognitoClient.send(command);
    
    if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
        res.json(msgBuilder(undefined, {
            challengeName: response.ChallengeName,
            session: response.Session,
        }));
    } else {
        const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
        res.json(msgBuilder(undefined, { 
            idToken: IdToken,
            accessToken: AccessToken,
            refreshToken: RefreshToken,
            mfaEnabled: false,
        }));
    }
}
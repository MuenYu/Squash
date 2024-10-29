import { errBuilder, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { 
    AssociateSoftwareTokenCommand,
    VerifySoftwareTokenCommand,
    SetUserMFAPreferenceCommand,
    RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";

export async function setupMFA(req, res) {
    const { accessToken } = req.body;

    const command = new AssociateSoftwareTokenCommand({
        AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);
    res.json(msgBuilder(undefined, { secretCode: response.SecretCode }));
}

export async function verifyMFA(req, res) {
    const { accessToken, userCode } = req.body;

    const verifyCommand = new VerifySoftwareTokenCommand({
        AccessToken: accessToken,
        UserCode: userCode,
    });

    await cognitoClient.send(verifyCommand);

    const setMfaCommand = new SetUserMFAPreferenceCommand({
        AccessToken: accessToken,
        SoftwareTokenMfaSettings: {
            Enabled: true,
            PreferredMfa: true,
        },
    });

    await cognitoClient.send(setMfaCommand);
    res.json(msgBuilder("MFA setup successful"));
}

export async function verifyMFAChallenge(req, res) {
    const { username, session, mfaCode } = req.body;

    const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: "SOFTWARE_TOKEN_MFA",
        ChallengeResponses: {
            USERNAME: username,
            SOFTWARE_TOKEN_MFA_CODE: mfaCode,
        },
        Session: session,
    });

    const response = await cognitoClient.send(command);
    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    res.json(msgBuilder(undefined, { 
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        mfaEnabled: true,
    }));
}
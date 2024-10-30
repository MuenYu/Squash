import { Err, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { 
    AssociateSoftwareTokenCommand,
    VerifySoftwareTokenCommand,
    SetUserMFAPreferenceCommand,
    RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";

export async function setupMFA(req, res, next) {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            throw new Err(401, "Access token is required");
        }

        const command = new AssociateSoftwareTokenCommand({
            AccessToken: accessToken,
        });

        const response = await cognitoClient.send(command);
        
        if (!response.SecretCode) {
            throw new Err(500, "Failed to generate MFA secret code");
        }

        res.json(msgBuilder(undefined, { secretCode: response.SecretCode }));
    } catch (error) {
        if (error.name === 'NotAuthorizedException') {
            next(new Err(401, "Invalid or expired access token"));
        } else if (error.name === 'InvalidParameterException') {
            next(new Err(400, "Invalid parameters provided"));
        } else if (error.name === 'ResourceNotFoundException') {
            next(new Err(404, "User not found"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            console.error('MFA setup error:', error);
            next(new Err(500, "Failed to setup MFA. Please try again later"));
        }
    }
}

export async function verifyMFA(req, res, next) {
    try {
        const { accessToken, userCode } = req.body;

        if (!accessToken || !userCode) {
            throw new Err(400, "Access token and verification code are required");
        }

        // Validate MFA code format (usually 6 digits)
        if (!/^\d{6}$/.test(userCode)) {
            throw new Err(400, "Invalid MFA code format. Must be 6 digits");
        }

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
    } catch (error) {
        if (error.name === 'NotAuthorizedException') {
            next(new Err(401, "Invalid or expired access token"));
        } else if (error.name === 'CodeMismatchException') {
            next(new Err(400, "Invalid verification code"));
        } else if (error.name === 'EnableSoftwareTokenMFAException') {
            next(new Err(400, "Failed to enable MFA. Please try setting up MFA again"));
        } else if (error.name === 'SoftwareTokenMFANotFoundException') {
            next(new Err(404, "MFA has not been set up for this user"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            console.error('MFA verification error:', error);
            next(new Err(500, "Failed to verify MFA. Please try again later"));
        }
    }
}

export async function verifyMFAChallenge(req, res, next) {
    try {
        const { username, session, mfaCode } = req.body;

        if (!username || !session || !mfaCode) {
            throw new Err(400, "Username, session, and MFA code are required");
        }

        // Validate MFA code format
        if (!/^\d{6}$/.test(mfaCode)) {
            throw new Err(400, "Invalid MFA code format. Must be 6 digits");
        }

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
        
        if (!response.AuthenticationResult) {
            throw new Err(500, "Authentication failed. Missing authentication result");
        }

        const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

        // Validate required tokens
        if (!IdToken || !AccessToken) {
            throw new Err(500, "Authentication failed. Invalid token response");
        }

        res.json(msgBuilder(undefined, { 
            idToken: IdToken,
            accessToken: AccessToken,
            refreshToken: RefreshToken,
            mfaEnabled: true,
        }));
    } catch (error) {
        if (error.name === 'CodeMismatchException') {
            next(new Err(400, "Invalid MFA code"));
        } else if (error.name === 'ExpiredCodeException') {
            next(new Err(400, "MFA code has expired"));
        } else if (error.name === 'InvalidSessionException') {
            next(new Err(401, "Invalid or expired session"));
        } else if (error.name === 'TooManyRequestsException') {
            next(new Err(429, "Too many attempts. Please try again later"));
        } else if (error.name === 'NotAuthorizedException') {
            next(new Err(401, "Authentication failed"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            console.error('MFA challenge verification error:', error);
            next(new Err(500, "Failed to verify MFA challenge. Please try again later"));
        }
    }
}
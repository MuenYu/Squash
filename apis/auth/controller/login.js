import { Err, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            throw new Err(400, "Username and password are required");
        }

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
        } else if (!response.AuthenticationResult) {
            // Handle case where authentication result is missing
            throw new Err(500, "Authentication failed. Missing authentication result.");
        } else {
            const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
            
            // Validate that we received the required tokens
            if (!IdToken || !AccessToken) {
                throw new Err(500, "Authentication failed. Invalid token response.");
            }

            res.json(msgBuilder(undefined, { 
                idToken: IdToken,
                accessToken: AccessToken,
                refreshToken: RefreshToken,
                mfaEnabled: false,
            }));
        }
    } catch (error) {
        // Handle AWS Cognito specific errors
        if (error.name === 'NotAuthorizedException') {
            next(new Err(401, "Incorrect username or password"));
        } else if (error.name === 'UserNotConfirmedException') {
            next(new Err(403, "Email not verified. Please verify your email first"));
        } else if (error.name === 'UserNotFoundException') {
            // For security reasons, keep the message vague
            next(new Err(401, "Incorrect username or password"));
        } else if (error.name === 'TooManyRequestsException') {
            next(new Err(429, "Too many login attempts. Please try again later"));
        } else if (error.name === 'InvalidParameterException') {
            next(new Err(400, "Invalid login parameters provided"));
        } else if (error.name === 'PasswordResetRequiredException') {
            next(new Err(403, "Password reset required. Please reset your password"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            // Handle unexpected errors
            console.error('Login error:', error);  // Log the actual error for debugging
            next(new Err(500, "Login failed. Please try again later"));
        }
    }
}
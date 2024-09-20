import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import { getSecret } from "../utils/secretmanager.js";
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  SetUserMFAPreferenceCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";


const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const CLIENT_ID = await getSecret('clientId')


export const register = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email }
      ]
    });

    await cognitoClient.send(command);
    res.status(200).json({ message: "Registration successful. Check your email for verification code." });
  } catch (error) {
    errBuilder(400, error.message);
  }
});

export const confirmRegistration = asyncHandler(async (req, res) => {
  const { username, code } = req.body;

  if (!username || !code) {
    return errBuilder(400, "Username and verification code are required");
  }

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: username,
      ConfirmationCode: code
    });

    await cognitoClient.send(command);
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    errBuilder(400, error.message);
  }
});

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
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
      // User has MFA enabled, return challenge
      res.json({
        challengeName: response.ChallengeName,
        session: response.Session,
      });
    } else {
      // No MFA, return tokens
      const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
      res.json({ 
        idToken: IdToken,
        accessToken: AccessToken,
        refreshToken: RefreshToken,
        mfaEnabled: false,
      });
    }
  } catch (error) {
    errBuilder(401, "Invalid username or password");
  }
});

export const setupMFA = asyncHandler(async (req, res) => {
  const { accessToken } = req.body;

  try {
    const command = new AssociateSoftwareTokenCommand({
      AccessToken: accessToken,
    });

    const response = await cognitoClient.send(command);
    res.json({ secretCode: response.SecretCode });
  } catch (error) {
    errBuilder(400, error.message);
  }
});

export const verifyMFA = asyncHandler(async (req, res) => {
  const { accessToken, userCode } = req.body;

  try {
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

    res.json({ message: "MFA setup successful" });
  } catch (error) {
    errBuilder(400, error.message);
  }
});

export const verifyMFAChallenge = asyncHandler(async (req, res) => {
  const { username, session, mfaCode } = req.body;

  try {
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

    res.json({ 
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
      mfaEnabled: true,
    });
  } catch (error) {
    errBuilder(401, "Invalid MFA code");
  }
});
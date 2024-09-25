import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import { getSecret } from "../utils/secretmanager.js";
import { getParameter } from "../utils/parameterstore.js";
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AssociateSoftwareTokenCommand,
  VerifySoftwareTokenCommand,
  SetUserMFAPreferenceCommand,
  RespondToAuthChallengeCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import axios from 'axios';

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const CLIENT_ID = await getSecret('clientId')
const cognitoDomain = await getSecret('cognitoDomain')
const redirect_uri = await getParameter('redirect_uri')

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

export const handleGoogleAuth = async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange authorization code for Cognito tokens
    const tokenResponse = await axios.post(`https://${cognitoDomain}/oauth2/token`, 
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: redirect_uri
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { id_token, access_token, refresh_token } = tokenResponse.data;

    // Send tokens back to the client
    res.json({ 
      idToken: id_token, 
      accessToken: access_token, 
      refreshToken: refresh_token 
    });

  } catch (error) {
    console.error('Google auth error:', error.response ? error.response.data : error);
    res.status(500).json({ 
      message: 'Authentication failed', 
      error: error.message,
      details: error.response ? error.response.data : 'No additional details'
    });
  }
};

export const getGoogleSignInUrl = asyncHandler(async (req, res) => {
  const url = `https://${cognitoDomain}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirect_uri)}&identity_provider=Google`;
  res.json({ url });
});
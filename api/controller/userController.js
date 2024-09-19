import asyncHandler from "express-async-handler";
import { errBuilder } from "../middleware/err.js";
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand
} from "@aws-sdk/client-cognito-identity-provider";

// TODO: change the region to AU
const cognitoClient = new CognitoIdentityProviderClient({ region: 'ap-northeast-1' });
const CLIENT_ID = '4pt7k3nbsrebnuvsq2fsna9hvh';

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
    
    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;

    res.json({ 
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken
    });
  } catch (error) {
    errBuilder(401, "Invalid username or password");
  }
});
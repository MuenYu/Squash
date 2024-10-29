import { errBuilder, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function register(req, res) {
    const { username, password, email } = req.body;

    const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: [
            { Name: "email", Value: email }
        ]
    });

    await cognitoClient.send(command);
    res.json(msgBuilder("Registration successful. Check your email for verification code."));
}

export async function confirmRegistration(req, res) {
    const { username, code } = req.body;

    if (!username || !code) {
        errBuilder(400, "Username and verification code are required");
    }

    const command = new ConfirmSignUpCommand({
        ClientId: await CLIENT_ID,
        Username: username,
        ConfirmationCode: code
    });

    await cognitoClient.send(command);
    res.json(msgBuilder("Email verified successfully."));
}

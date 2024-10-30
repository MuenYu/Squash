import { Err, msgBuilder } from "../../shared/index.js";
import { cognitoClient, CLIENT_ID } from "./cognitoclient.js";
import { SignUpCommand, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function register(req, res, next) {
    try {
        const { username, password, email } = req.body;
        
        // Validate required fields
        if (!username || !password || !email) {
            throw new Err(400, "Username, password, and email are required");
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Err(400, "Invalid email format");
        }

        // Validate password strength (minimum 8 characters, at least one number and one letter)
        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            throw new Err(400, "Password must be at least 8 characters long and contain at least one number and one letter");
        }

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
    } catch (error) {
        // Handle AWS Cognito specific errors
        if (error.name === 'UsernameExistsException') {
            next(new Err(409, "Username already exists"));
        } else if (error.name === 'InvalidPasswordException') {
            next(new Err(400, "Password does not meet requirements"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            // Handle unexpected errors
            next(new Err(500, "Registration failed. Please try again later."));
        }
    }
}

export async function confirmRegistration(req, res, next) {
    try {
        const { username, code } = req.body;

        if (!username || !code) {
            throw new Err(400, "Username and verification code are required");
        }

        const command = new ConfirmSignUpCommand({
            ClientId: await CLIENT_ID,
            Username: username,
            ConfirmationCode: code
        });

        await cognitoClient.send(command);
        res.json(msgBuilder("Email verified successfully."));
    } catch (error) {
        // Handle AWS Cognito specific errors
        if (error.name === 'CodeMismatchException') {
            next(new Err(400, "Invalid verification code"));
        } else if (error.name === 'ExpiredCodeException') {
            next(new Err(400, "Verification code has expired"));
        } else if (error.name === 'UserNotFoundException') {
            next(new Err(404, "User not found"));
        } else if (error instanceof Err) {
            next(error);
        } else {
            // Handle unexpected errors
            next(new Err(500, "Verification failed. Please try again later."));
        }
    }
}
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { region } from "../shared/const.js";
import { getParameter } from "../../shared/index.js";

export const cognitoClient = new CognitoIdentityProviderClient({ region });
export const CLIENT_ID = await getParameter('clientId');
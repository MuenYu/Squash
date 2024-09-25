import SSM from "@aws-sdk/client-ssm"
import { region, ssmPrefix } from "./const.js";

const client = new SSM.SSMClient({region: region})
const prefix = ssmPrefix

/**
 * fetch the parameter from AWS parameter store
 * @param {*} key the key name of the parameter
 * @returns 
 */
export async function getParameter(key) {
    try {
        const response = await client.send(
           new SSM.GetParameterCommand({
              Name: `${prefix}/${key}`
           })
        );
        return response.Parameter.Value;
     } catch (error) {
        console.log(error);
        throw error
     }
}
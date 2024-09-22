import SSM from "@aws-sdk/client-ssm"

const client = new SSM.SSMClient({region: process.env.AWS_REGION})

/**
 * fetch the parameter from AWS parameter store
 * @param {*} key the key name of the parameter
 * @returns 
 */
export async function getParameter(key) {
    try {
        const response = await client.send(
           new SSM.GetParameterCommand({
              Name: key
           })
        );
        return response.Parameter.Value;
     } catch (error) {
        console.log(error);
        throw error
     }
}
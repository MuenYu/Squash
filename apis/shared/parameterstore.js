import SSM from "@aws-sdk/client-ssm"
import { region, prefix } from "./const.js"

const client = new SSM.SSMClient({ region: region })

/**
 * fetch the parameter from AWS parameter store
 * @param {*} key the key name of the parameter
 * @returns 
 */
export async function getParameter(key) {
   const envVal = process.env[key]
   if (envVal) return envVal
   try {
      const response = await client.send(
         new SSM.GetParameterCommand({
            Name: prefix
         })
      )
      const parameters = JSON.parse(response.Parameter.Value)
      return parameters[key]
   } catch (error) {
      console.log(error)
      throw error
   }
}
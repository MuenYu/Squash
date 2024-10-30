import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
import { getParameter } from './parameterstore.js'
import { region } from './const.js'

const sqsUrl = await getParameter('sqsUrl')
const sqsClient = new SQSClient({
    region: region
})

export async function send(msg) {
    const command = new SendMessageCommand({
        QueueUrl: sqsUrl,
        MessageBody: JSON.stringify(msg)
    })
    await sqsClient.send(command)
}
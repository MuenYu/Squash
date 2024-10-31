import { DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs'
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

export async function receive() {
    const command = new ReceiveMessageCommand({
        MaxNumberOfMessages: 1,
        QueueUrl: sqsUrl,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 180,
    })
    const resp = await sqsClient.send(command)
    if (!resp?.Messages) return null
    return resp.Messages[0]
}

export async function del(receipt) {
    const command = new DeleteMessageCommand({
        QueueUrl: sqsUrl,
        ReceiptHandle: receipt,
    })
    await sqsClient.send(command)
}
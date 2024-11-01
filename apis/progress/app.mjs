import {
    MemcacheClient,
} from "memcache-client"

// msg body
// {
//     requestContext: {
//         elb: {
//             targetGroupArn: "arn:aws:elasticloadbalancing:region:account-id:targetgroup/target-group-name/1234567890abcdef"
//         }
//     },
//     httpMethod: "GET",
//     path: "/123",
//     pathParameters: {
//         taskId: "123"
//     },
//     headers: {
//         "Content-Type": "application/json",
//     },
//     body: null,
//     isBase64Encoded: false
// }

const cache = new MemcacheClient({server: process.env.memcache})

// app.mjs
export async function handler(event) {
    const taskId = event.pathParameters.taskId
    const progress = await cache.get(taskId)
    return {
        statusCode: 200,
        body: JSON.stringify({
            msg: `${taskId}: ${progress}`
        })
    }
}

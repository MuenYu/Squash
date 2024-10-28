import { getSecret, getParameter } from '../shared/index.js'

console.log(await getParameter('test'))
console.log(await getSecret('test'))
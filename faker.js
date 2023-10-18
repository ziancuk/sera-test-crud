import { connections } from "./connection.js"

connections()

const args = process.argv

const fakerfile = args[2]
const limit = args[3] || 10
const faker = await import(`./faker/${fakerfile}`)

faker.run(limit)
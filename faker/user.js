import user from '../models/User.js';
import { faker } from '@faker-js/faker'

const run = async (limit) => {
    try {
        let data = []
        for (let i = 0; i < limit; i++) {
            data.push({
                fullname: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            })
        }
        const newUser = await user.insertMany(data) 
        
        if(newUser) {
            console.log('Total Insert Data : ' + newUser.length)
            process.exit()
        }
    } catch(err) {
        console.log(err)
        process.exit()
    }
}

export { run }
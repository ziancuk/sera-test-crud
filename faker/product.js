import product from '../models/Products.js';
import { faker } from '@faker-js/faker'

const run = async (limit) => {
    try {
        let data = []
        for (let i = 0; i < limit; i++) {
            data.push({
                title: faker.word.adjective(),
                description: faker.lorem.lines()                ,
                price: faker.number.int({ max: 10000000 }),
            })
        }
        const newProduct = await product.insertMany(data) 
        
        if(newProduct) {
            console.log('Total Insert Data : ' + newProduct.length)
            process.exit()
        }
    } catch(err) {
        console.log(err)
        process.exit()
    }
}

export { run }
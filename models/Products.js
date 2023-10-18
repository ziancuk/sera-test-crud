import mongoose, { mongo } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    },
},
{
    timestamps: { currentTyme: () => Math.floor(Date.now() / 100) }
})


Schema.plugin(mongoosePaginate)

export default mongoose.model('Products', Schema)
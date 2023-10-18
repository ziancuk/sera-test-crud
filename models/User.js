import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const Schema = mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin',
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

export default mongoose.model('User', Schema)
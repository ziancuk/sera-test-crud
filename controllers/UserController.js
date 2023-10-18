import user from '../models/User.js'
import bcrypt from 'bcrypt'
import { isEmailExist, isEmailExistWithUserId } from '../libraries/isEmailExist.js'

const index = async (req, res) => {
    try{
        const searchCondition = req.query.search
        ? { fullname: { $regex: req.query.search, $options: 'i' } }
        : {};

        const active = {status:'active'}

        const users = await user.find({
                $and: [
                    active,
                    searchCondition
                ]})
        .skip(req.query.skip)
        .limit(req.query.take)

        if(!users) { throw { code: 500, message: 'GET_USER_FAILED' } }
        return res.status(200).json({
            code: 200,
            message: 'Success', 
            data: users
        });

    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const show = async (req, res) => {
    try{
        if(!req.params.id) { throw { code: 428, message: 'ID is Required' } }

        const User = await user.findById(req.params.id)
        if(!User) { throw { code: 404, message: 'User Not Found' } }

        return res.status(200).json({
            code: 200,
            message: 'Success', 
            data: User
        });

    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const update = async (req, res) => {
    try{

        if(!req.body.fullname) { throw { code: 428, message: "Fullname is required"}}
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.role) { throw { code: 428, message: "Role is required"}}

        if(req.body.password !== req.body.password_confirmation) {
            throw { code: 428, message: "Password do not match"}
        }

        const emailExist = await isEmailExistWithUserId(req.params.id, req.body.email)
        if(emailExist) { throw { code: 409, message: "Email is exist"}}

        let fields = {}
        fields.fullname = req.body.fullname;
        fields.email = req.body.email;
        fields.role = req.body.role;
        
        if(req.body.password) {
            let salt = await bcrypt.genSalt(10)
            let hash = await bcrypt.hash(req.body.password, salt)
            fields.password = hash;
        }

        const User = await user.findByIdAndUpdate(req.params.id, fields, { new : true });

        if(!User) { throw { code: 500, message: "USER_UPDATE_FAILED" } }

        return res.status(200).json({
            code: 200, 
            message: 'USER_UPDATE_SUCCESS',
            data: User
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const destroy = async (req, res) => {
    try{

        if(!req.params.id) { throw { code: 428, message: "ID is required"}}

        let fields = {}
        fields.status = 'inactive';

        const User = await user.findByIdAndUpdate(req.params.id, fields, { new : true });
        if(!User) { throw { code: 500, message: "USER_DELETE_FAILED" } }

        return res.status(200).json({
            code: 200,
            message: 'USER_DELETE_SUCCESS',
            data: User
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const store = async (req, res) => {
    try{

        if(!req.body.fullname) { throw { code: 428, message: "Fullname is required"}}
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.password) { throw { code: 428, message: "Password is required"}}
        if(!req.body.role) { throw { code: 428, message: "Role is required"}}

        if(req.body.password !== req.body.password_confirmation) {
            throw { code: 428, message: "Password do not match"}
        }

        const emailExist = await isEmailExist(req.body.email)
        if(emailExist) { throw { code: 409, message: "Email is exist"}}

        let salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(req.body.password, salt)

        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = hash;
        const role = req.body.role;

        const newUser = new user({
            fullname: fullname,
            email: email,
            password: password,
            role: role
        })

        const User = await newUser.save()

        if(!User) { throw { code: 500, message: "USER_REGISTER_FAILED" } }

        return res.status(200).json({
            code: 200,
            message: 'Success', 
            data : User
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

export default { index, store, update, show, destroy }
import user from '../models/User.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
import { isEmailExist } from '../libraries/isEmailExist.js'

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_ACCESS_TOKEN,
        { expiresIn: env.JWT_ACCESS_TOKEN_LIFE }
    )
}

const generateRefreshToken = async (payload) => {
    return jsonwebtoken.sign(
        payload,
        env.JWT_REFRESH_TOKEN,
        { expiresIn: env.JWT_REFRESH_TOKEN_LIFE }
    )
}

const checkEmail = async (req, res) => {
    try{
        const email = await isEmailExist(req.body.email)
        if(email) { throw { code: 428, message: 'EMAIL_EXIST' } }

        return res.status(200).json({
            code: 200,
            message: 'EMAIL_NOT_EXIST'
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const register = async (req, res) => {
    try{

        if(!req.body.fullname) { throw { code: 428, message: "Fullname is required"}}
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.password) { throw { code: 428, message: "Password is required"}}

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
            status: 'SUCCESS',
            data: User
        });
    } catch(err) {
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

const refreshToken = async (req, res) => {
    try{
        if(!req.body.refreshToken) { throw { code: 428, message: "REFRESH_TOKEN_REQUIRED"}}

        const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN)
        const payload = { id: verify.id, role: verify.role }

        const acessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)

        return res.status(200).json({
            code: 200,
            message: 'REFRESH_TOKEN_SUCCESS',
            data:{
                acessToken,
                refreshToken
            }
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        if(err.message == 'jwt expired') {
            err.message = 'REFRESH_TOKEN_EXPIRED'
        } else {
            err.message = 'REFRESH_TOKEN_INVALID'
        }
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}
const login = async (req, res) => {
    try{
        if(!req.body.email) { throw { code: 428, message: "Email is required"}}
        if(!req.body.password) { throw { code: 428, message: "Password is required"}}

        const User = await user.findOne({ email: req.body.email})
        if(!User) { throw { code: 404, message: "EMAIL_NOT_FOUND"}}
        
        const passwordMatch = await bcrypt.compareSync(req.body.password, User.password)
        if(!passwordMatch) { throw { code: 428, message: "WRONG_PASSWORD" } }

        const payload = { id: User._id, role:User.role }

        const acessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)

        return res.status(200).json({
            code: 200,
            message: 'LOGIN_SUCCESS',
            data :{
                fullname: User.fullname,
                acessToken,
                refreshToken
            }
        });
    } catch(err) {
        if(!err.code) {err.code = 500}
        return res.status(err.code).json({
            code: err.code,
            message: err.message
        })
    }
}

export default { register, login, refreshToken, checkEmail }
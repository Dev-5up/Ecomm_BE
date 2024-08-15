const bcrypt=require('bcryptjs')
const user_model=require('../models/user.model')
const jwt = require('jsonwebtoken');
const secret = require('../configs/auth.config');
const { message } = require('statuses')
exports.signup= async (req,res) => {
    const request_body= req.body
    const userObj={
        name: request_body.name,
        userId: request_body.userId,
        password: bcrypt.hashSync(request_body.password,8),
        email: request_body.email,
        userType:request_body.userType
    }
    try {
        user_created= await user_model.create(userObj)
        const res_obj={
            name: user_created.name,
            userId: user_created.userId,
            email: user_created.email,
            userType: user_created.userType,
            createdAt: user_created.createdAt,
            updatedAt: user_created.updatedAt
        }
        res.status(201).send(res_obj)//user response on creation is 201.
    } catch (error) {
        console.log("Error at user login",error);
        res.status(500).send({
            message:"Error occured while creating user."
        }) //user creation failure response is 500.
    }
}
exports.signin= async (req,res) => {
    //check user Id is valid
    const user= await user_model.findOne({userId: req.body.userId})
    if (user==null) {
        return res.status(404).send({
            message: "User ID not found"
        })
    }
    //check password is valid
    const isPasswordVaild=bcrypt.compareSync(req.body.password, user.password)
    if (isPasswordVaild==false) {
        return res.status(401).send({
            message: "Invalid Password"
        })
    }
    //generate token
    const token=jwt.sign({id: user.userId},secret.secret,{
        expiresIn: 300//Token will expire in 120Sec//
    })
    res.status(200).send({
        name: user.name,
        userId: user.userId,
        email:user.email,
        userType:user.userType,
        accessToken : token
    })
}
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userModel = require("../model/userModel")
const phoneCheck = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/
const emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidPassword = function (value) {
    if (value.length > 7 && value.length < 16) { return true }
};

//Create User
const registerUser = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide User details' })
        }
        let { Name, phone, email, password } = requestBody

        if (!isValid(Name)) {
            return res.status(400).send({ status: false, message: 'name is required' })
        }

        if (email) {
            if (!((emailCheck).test(email.trim()))) {
                res.status(400).send({ status: false, message: `Email should be a valid email address` })
                return
            }
            const isEmailAlreadyUsed = await userModel.findOne({ email });
            if (isEmailAlreadyUsed) {
                res.status(400).send({ status: false, message: `${email} mail is already registered` })
                return
            }
        }

        if (phone) {
            if (!((phoneCheck).test(phone))) {
                return res.status(400).send({ status: false, Message: "Please provide valid phone number" })
            }
            const isPhoneAlreadyUsed = await userModel.findOne({ phone });
            if (isPhoneAlreadyUsed) {
                res.status(400).send({ status: false, message: `${phone}  phone number is already registered` })
                return
            }
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'password is required' })
            return
        }
        if (!(isValidPassword)) {
            res.status(400).send({ status: false, message: `Password length should be between 8 and 15.` })
            return
        }

        const EncrypPassword = await bcrypt.hash(password, 10)
        const userData = {Name, phone, email, password: EncrypPassword}
        const newUser = await userModel.create(userData);

        res.status(201).send({ status: true, message: `user created successfully`, data: newUser });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//login User
const login = async function (req, res) {
    try {
        const requestBody = req.body
        let email = req.body.email
        let password = req.body.password
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide User details' })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'email is required' })
            return
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, message: 'password is required' })
            return
        }
        if (email && password) {
            let User = await userModel.findOne({ email: email })
            if (!User) {
                return res.status(400).send({ status: false, msg: "email does not exist" })
            }
            let decryppasss = await bcrypt.compare(password, User.password);
            if (decryppasss) {
                const token = await jwt.sign({ userId: User._id }, 'Saurabh', {
                    expiresIn: "3h"
                })
                res.header('x-api-key', token);
                res.status(200).send({ status: true, msg: "success", data: { userId: User._id, token: token } })
            } else {
                res.status(400).send({ status: false, Msg: "Invalid password write correct password" })
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.registerUser = registerUser
module.exports.login = login
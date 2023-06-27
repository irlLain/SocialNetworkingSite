const Joi = require("joi");
const db = require("../../database");
const userModels = require("../models/user.models");
const usersRoutes = require("../routes/users.routes");
var validator = require("email-validator");

var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();

const addNewUser = (req, res) => {
    const schema = Joi.object({
        "first_name": Joi.string().required(),
        "last_name": Joi.string().required(),
        "password": Joi.string().min(8).max(20).required(),
        "email": Joi.string().required()
    })

    passwordSchema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces();

    const { error } = schema.validate(req.body);
    console.log("err: " + error)
    if(error) return res.status(400).send(error.details[0].message);


    if( validator.validate(req.body.email) == false){
        return res.sendStatus(400);
    }

    if(passwordSchema.validate(req.body.password) == false){
        return res.sendStatus(400);
    }

    let user = Object.assign({}, req.body);

    userModels.addNewUser(user, (err, id) => {
        if(err) {
            console.log(err)
            return res.sendStatus(500);
        }

        return res.status(201).send({user_id: id})
    })
}

const getAllUsers = (req, res) => {
    userModels.getAllUsers((err, num_rows, results) =>{
        if(err) return res.sendStatus(500);
        return res.status(200).send(results); 
    })
}

const login = (req, res) => {


    const schema = Joi.object({
        "email": Joi.string().required(),
        "password": Joi.string().required()
    })



    const { error } = schema.validate(req.body);
    console.log("err: " + error)
    if(error) return res.status(400).send(error.details[0].message);

    userModels.authenticateUser(req.body.email, req.body.password, (err, id) =>
    {
        if(err === 404) return res.status(400).send("Invalid email/password")
        if(err) return res.sendStatus(500)

        userModels.getToken(id, (err, token) => {
            if(err) return res.status(500).send("get token error")

            if(token){
                return res.status(200).send({user_id: id, session_token: token})
            }else{
                console.log("reach")
                userModels.setToken(id, (err, token) => {
                    if(err) return res.sendStatus(500)
                    return res.status(200).send({user_id: id, session_token: token})
                })
            }
        })
    })
}

const logout = (req, res) => {
    let token = req.get("X-Authorization");
    userModels.removeToken(token, (err) => {
        if(err) return res.sendStatus(401)

        return res.sendStatus(200)
    })
}


module.exports = {
    addNewUser: addNewUser,
    getAllUsers: getAllUsers,
    login: login,
    logout: logout
}
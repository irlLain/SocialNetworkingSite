const Joi = require("joi");
const db = require("../../database");
const crypto = require("crypto");
const users = require("../models/user.models");

const getHash =function(password,salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    const sql = 'INSERT INTO users (first_name, last_name, email, password, salt) VALUES(?,?,?,?,?)'
    let values = [user.first_name, user.last_name, user.email, hash, salt.toString('hex')];

    db.run(
        sql, 
        values,
        function(err){
            if(err) return done(err, null);

            return done(null, this.lastID);
        }
    )
}
//creates a random salt and a hash of the password and salt, then inserts all the relevant user data 
//into the database's user table

const authenticateUser = (email, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE email =?'

    db.get(sql, [email], (err,row) => {
        if(err) return done(err)
        if(!row) return done(404) //wrong email

        if(row.salt === null) row.salt = ''
        let salt = Buffer.from(row.salt, 'hex')

        if(row.password === getHash(password, salt)){
            return done(false, row.user_id)
        }else{
            return done(404)//wrong password
        }
    })
}
//gets user record from database using the email, passes the password and salt to the getHash function
//checks the generated hash and the hash in the database are the same

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id =?'

    db.each(sql, [id], function(err, row) {

       /* return done(err, {
            session_token: row.session_token
        }) //login doesnt work with this
        */
        return done(err, row.session_token)  //breaks get all users but lets login work
    })
}


const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?'

    db.run(sql, [token, id], (err) => {
        return done(err,token)
    })
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?'

    db.run(sql, [token], (err) => {
        return done(err)
    })
}

const getIDFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?'

    db.get(sql, [token], (err, row) => {
        if(err) return done(err)
        if(!row) return done(404)

        return done(null, {
            user_id: row.user_id
        })
    })
}

const getAllUsers = (done) => {
    const results = [];

    db.each(
        "SELECT * FROM users",
        [],
        (err,row) => {
            if(err) console.log("Something went wrong: " + err);

            results.push({
                user_id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                salt: row.salt,
                session_token: row.session_token
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
   
}

module.exports = {
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    getToken:getToken,
    setToken: setToken,
    removeToken: removeToken,
    getAllUsers:getAllUsers,
    getIDFromToken: getIDFromToken
}
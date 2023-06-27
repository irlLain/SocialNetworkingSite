/*
    Test the User Management endpoints
*/

const fs = require("fs")
const chai = require("chai")
const chaiHttp = require("chai-http")

const expect = chai.expect
chai.use(chaiHttp)

const path = require('path');
const filename = path.basename(__filename);

const SERVER_URL = "http://localhost:3333"
const ADMIN_EMAIL = "admin@admin.com"
const ADMIN_PASSWORD = "Admin123!"
let ADMIN_TOKEN = ""

const good_user_data = require('./data/mock_users_good.json');
const bad_user_data = require('./data/mock_users_bad.json');

describe("Test creation of users if not logged in.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_user_data.forEach((user) => {
        it("Should return 401", () => {
            return chai.request(SERVER_URL)
                .post("/users")
                .send({
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "password": user.password
                 })
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})

describe("Log into admin account.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and JSON with user_id and session_token of admin.", () => {
        return chai.request(SERVER_URL)
            .post("/login")
            .send({
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
                })
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property("user_id")
                expect(res.body).to.have.property("session_token")
                ADMIN_TOKEN = res.body.session_token
            })
            .catch((err) => {
                throw err
            })
    })

})


describe("Test successful creation of users when logged in as admin.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    good_user_data.forEach((user) => {
        it("Should return 201, and JSON with user_id of new user: " + user.email, () => {
            return chai.request(SERVER_URL)
                .post("/users")
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "password": user.password
                 })
                .then((res) => {
                    expect(res).to.have.status(201)
                    expect(res).to.be.json
                    expect(res.body).to.have.property("user_id")
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})

describe('Test malformed creation of users, logged in as admin.', () => {

    before(() => {
        console.log('[Script: ' + filename + ']')
    });

    bad_user_data.forEach((user) => {
        it('Should return 400 status code: ' + user.test_description, () => {
            return chai.request(SERVER_URL)
                .post('/users')
                .set('X-Authorization', ADMIN_TOKEN)
                .send({
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "password": user.password
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                })
                .catch((err) => {
                    throw err
                });
        });
    });

    it('Should return 400 status code: missing first name', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .set('X-Authorization', ADMIN_TOKEN)
            .send({
                "last_name": good_user_data[0].last_name,
                "email": good_user_data[0].email,
                "password": good_user_data[0].password
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: missing last name', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .set('X-Authorization', ADMIN_TOKEN)
            .send({
                "first_name": good_user_data[0].first_name,
                "email": good_user_data[0].email,
                "password": good_user_data[0].password
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: missing email', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .set('X-Authorization', ADMIN_TOKEN)
            .send({
                "first_name": good_user_data[0].first_name,
                "last_name": good_user_data[0].last_name,
                "password": good_user_data[0].password
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: missing password', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .set('X-Authorization', ADMIN_TOKEN)
            .send({
                "first_name": good_user_data[0].first_name,
                "last_name": good_user_data[0].last_name,
                "email": good_user_data[0].email
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });

    it('Should return 400 status code: extra field', () => {
        return chai.request(SERVER_URL)
            .post('/users')
            .set('X-Authorization', ADMIN_TOKEN)
            .send({
                "first_name": good_user_data[0].first_name,
                "last_name": good_user_data[0].last_name,
                "password": good_user_data[0].password,
                "email": good_user_data[0].email,
                "extra": "field"
            })
            .then((res) => {
                expect(res).to.have.status(400);
            })
            .catch((err) => {
                throw err
            });
    });
});
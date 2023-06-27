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

describe("Test getting users if not logged in.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 401", () => {
            return chai.request(SERVER_URL)
                .get("/users")
                .then((res) => {
                    expect(res).to.have.status(401)
                })
                .catch((err) => {
                    throw err
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

describe("Test getting users when logged in as admin.", () => {

    before(() => {
        console.log("[Script: " + filename + "]")
    })

    it("Should return 200, and be an array of created users", () => {
            return chai.request(SERVER_URL)
                .get("/users")
                .set('X-Authorization', ADMIN_TOKEN)
                .then((res) => {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body.length).to.equal(21)

                    res.body.forEach(element => {
                        expect(element).to.have.property("user_id")
                        expect(element).to.have.property("first_name")
                        expect(element).to.have.property("last_name")
                        expect(element).to.have.property("email")
                        expect(element).to.not.have.property("password")
                    });
                })
                .catch((err) => {
                    throw err
                })
    })
})


